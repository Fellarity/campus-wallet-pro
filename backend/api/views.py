from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db import transaction
from decimal import Decimal
from .models import CustomUser, Wallet, Transaction
from .serializers import WalletSerializer, PaymentSerializer # Add PaymentSerializer

class WalletDataView(APIView):
    # This line locks the view.
    # Only users who are "authenticated" (logged in with a token) can access it.
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        This GET method runs when the app asks for data.
        """
        # 'request.user' is the CustomUser object for the logged-in user
        # We find their wallet using the 'wallet' related_name we set in models.py
        wallet = request.user.wallet

        # We use our serializer to convert the wallet object to JSON
        serializer = WalletSerializer(wallet)

        # We return the serialized data
        return Response(serializer.data)

class PaymentView(APIView):
    """
    Handles a new payment from a user to a vendor.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # 1. Validate the incoming data (amount, vendor_id)
        serializer = PaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        validated_data = serializer.validated_data
        amount_to_pay = validated_data['amount']
        vendor_username = validated_data['vendor_id']

        # 2. Get the payer (the logged-in user)
        payer = request.user
        payer_wallet = payer.wallet

        try:
            # 3. Find the vendor's wallet
            vendor = CustomUser.objects.get(username=vendor_username)
            vendor_wallet = vendor.wallet
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Vendor not found.'}, status=404)

        # 4. Check for self-payment
        if payer_wallet == vendor_wallet:
            return Response({'detail': 'You cannot pay yourself.'}, status=400)

        # 5. Check for sufficient funds
        if payer_wallet.balance < amount_to_pay:
            return Response({'detail': 'Insufficient funds.'}, status=400)

        # 6. --- Perform the Transaction ---
        # This 'atomic' block means if *any* part fails,
        # the whole thing is rolled back. No one loses money.
        try:
            with transaction.atomic():
                # Subtract from payer
                payer_wallet.balance -= amount_to_pay
                payer_wallet.save()

                # Add to vendor
                vendor_wallet.balance += amount_to_pay
                vendor_wallet.save()

                # Log transaction for Payer
                Transaction.objects.create(
                    wallet=payer_wallet,
                    transaction_type='payment',
                    amount=-amount_to_pay, # Negative amount
                    description=f'Payment to {vendor_username}'
                )

                # Log transaction for Vendor
                Transaction.objects.create(
                    wallet=vendor_wallet,
                    transaction_type='deposit',
                    amount=amount_to_pay, # Positive amount
                    description=f'Payment from {payer.username}'
                )

        except Exception as e:
            # If something went wrong, return a server error
            return Response({'detail': f'An error occurred: {str(e)}'}, status=500)

        # 7. Return the new wallet balance on success
        # We re-serialize the payer's wallet to send back the updated info
        updated_wallet_data = WalletSerializer(payer_wallet).data
        return Response({
            'detail': 'Payment successful!',
            'wallet': updated_wallet_data
        }, status=200)