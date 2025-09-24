from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
import random

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def asignar_color_avatar(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'avatar_color'):
        colores = ["e63946","f1faee","a8dadc","457b9d","1d3557","ffb703","fb8500"]
        instance.avatar_color = random.choice(colores)
        instance.save()
