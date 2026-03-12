from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf import settings

# 1. Our new, custom User model
class CustomUser(AbstractUser):
    student_id = models.CharField(max_length=100, unique=True, null=True, blank=True)

    # --- FIX for E336 errors ---
    # We override these fields to provide unique 'related_name's
    # This resolves the conflict with the built-in auth app.
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_groups",  # <--- Unique related_name
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_permissions", # <--- Unique related_name
        related_query_name="user",
    )
    # --- END OF FIX ---

    def __str__(self):
        return self.username

# 2. The Wallet model
class Wallet(models.Model):
    # This links the Wallet to our CustomUser.
    # OneToOneField means one user has exactly one wallet.
    # on_delete=models.CASCADE means if a user is deleted, their wallet is too.
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    
    # We use DecimalField for money.
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Points are whole numbers.
    loyalty_points = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Wallet"

# 3. The Transaction model
class Transaction(models.Model):
    # A wallet can have MANY transactions, so we use ForeignKey.
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    
    TRANSACTION_TYPES = (
        ('deposit', 'Deposit'),
        ('payment', 'Payment'),
        ('points_earn', 'Points Earned'),
        ('points_redeem', 'Points Redeemed'),
    )
    
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    
    # Amount can be positive or negative
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Points can also be positive or negative
    points_amount = models.IntegerField(default=0)
    
    description = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True) # Automatically sets the time

    def __str__(self):
        return f"{self.wallet.user.username} - {self.description}"