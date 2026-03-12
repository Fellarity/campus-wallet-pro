from rest_framework import serializers
from .models import Wallet, Transaction, CustomUser

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        # List the fields you want to show in the API
        fields = ['id', 'transaction_type', 'amount', 'points_amount', 'description', 'timestamp']

class WalletSerializer(serializers.ModelSerializer):
    # This is a "nested" serializer.
    # It tells Django to find all transactions related to this wallet
    # and use the 'TransactionSerializer' to display them.
    transactions = TransactionSerializer(many=True, read_only=True)
    username = serializers.StringRelatedField(source='user')

    class Meta:
        model = Wallet
        fields = ['id', 'user','username', 'balance', 'loyalty_points', 'transactions']

        # 'user' is read-only, it's set automatically
        read_only_fields = ['user']

class PaymentSerializer(serializers.Serializer):
    """
    Serializer to validate the data for a new payment.
    """
    # We'll use the vendor's username as their "ID"
    vendor_id = serializers.CharField(max_length=150)

    # We need a positive amount
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)