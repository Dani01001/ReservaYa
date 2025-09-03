# reservas/api_views.py
from rest_framework import viewsets
from .models import Reserva
from .serializers import ReservaSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

@api_view(['GET'])
def usuario_actual(request):
    if request.user.is_authenticated:
        return Response({"usuario": request.user.username})
    else:
        return Response({"detail": "No autenticado"}, status=401)
