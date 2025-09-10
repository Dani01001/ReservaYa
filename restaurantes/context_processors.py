from django.conf import settings

def server_host(request):
    return {
        "SERVER_HOST": settings.SERVER_HOST
    }
