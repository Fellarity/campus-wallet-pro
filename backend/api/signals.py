from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Wallet

# This function is called "receiver"
# It "listens" for a 'post_save' signal from the User model
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_wallet(sender, instance, created, **kwargs):
    # 'created' will be True only the first time the user is saved
    if created:
        # Create a new Wallet and link it to the new user 'instance'
        Wallet.objects.create(user=instance)