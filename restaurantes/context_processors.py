from django.conf import settings
def server_host(request):
    return {
        "SERVER_HOST": settings.SERVER_HOST
    }
def user_context(request):
    return {
        "user": request.user if request.user.is_authenticated else None
    }