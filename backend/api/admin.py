from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Wallet, Transaction

# This class tells Django to use its built-in, secure
# admin pages for our CustomUser.
class CustomUserAdmin(UserAdmin):
    # You can add more customizations here later
    pass

# We un-register the old, simple version first
# (It's okay if this gives an error, just ignore it)
try:
    admin.site.unregister(CustomUser)
except admin.sites.NotRegistered:
    pass

# Now we register our CustomUser with the *correct* admin class
admin.site.register(CustomUser, CustomUserAdmin)

# These two are still correct
admin.site.register(Wallet)
admin.site.register(Transaction)