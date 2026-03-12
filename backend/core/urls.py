from django.contrib import admin
from django.urls import path, include  # <-- Add 'include'

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- Add this line ---
    # It tells Django to send any request to our 'api.urls' file
    path('', include('api.urls')),
    # --- End of new line ---
]