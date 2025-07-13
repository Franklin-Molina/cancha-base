from rest_framework import serializers
from rest_framework.exceptions import ValidationError # Importar ValidationError
from .models import Booking
from users.models import User # Importar el modelo User
from courts.models import Court # Importar el modelo Court
from courts.serializers import CourtSerializer # Importar CourtSerializer
from django.utils import timezone # Importar timezone

class BookingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        default=serializers.CurrentUserDefault()
    )
    court_details = CourtSerializer(source='court', read_only=True)
    court = serializers.PrimaryKeyRelatedField(
        queryset=Court.objects.all(), write_only=True
    )

    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()

    class Meta:
        model = Booking
        fields = ('id', 'user', 'court', 'court_details', 'start_time', 'end_time', 'status', 'payment')

    # No es necesario sobrescribir create si usamos CurrentUserDefault

    def validate(self, data):
        """
        Valida que la cancha no esté reservada en el rango de tiempo solicitado.
        """
        # El usuario ya estará en data.get('user') gracias a CurrentUserDefault
        user = data.get('user') 
        if not user:
             # Esto no debería ocurrir con CurrentUserDefault si el usuario está autenticado,
             # pero se mantiene como seguridad.
            raise ValidationError("El usuario no está autenticado.")

        court = data.get('court')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if not court or not start_time or not end_time:
            # La validación a nivel de campo ya debería manejar esto,
            # pero es bueno tener una verificación aquí también.
            return data

        # Excluir la instancia actual si se está actualizando una reserva existente
        instance = self.instance
        if instance:
            overlapping_bookings = Booking.objects.filter(
                court=court,
                start_time__lt=end_time,
                end_time__gt=start_time,
                status__in=['pending', 'confirmed']
            ).exclude(pk=instance.pk)
        else:
            overlapping_bookings = Booking.objects.filter(
                court=court,
                start_time__lt=end_time,
                end_time__gt=start_time,
                status__in=['pending', 'confirmed']
            )

        if overlapping_bookings.exists():
            raise ValidationError("La cancha no está disponible en el rango de tiempo solicitado.")

        # Validar que la hora de inicio sea anterior a la hora de fin (ya validado en el modelo, pero se puede reforzar aquí)
        if start_time >= end_time:
             raise ValidationError({'end_time': 'La hora de fin debe ser posterior a la hora de inicio.'})


        return data
