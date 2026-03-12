from django.apps import AppConfig

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    # --- Add these two lines ---
    def ready(self):
        import api.signals  # This imports our signals file