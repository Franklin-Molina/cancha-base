from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.password_validation import validate_password as django_validate_password # Importar validador de contraseña de Django
from django.core.validators import RegexValidator # Para validar nombres
from django.utils import timezone # Para validar fechas
from rest_framework.validators import UniqueValidator # Para validar unicidad
from .models import User, PerfilSocial, Role # Importar Role
import datetime # Para calcular la edad

class UserSerializer(serializers.ModelSerializer):
    # Cambiar 'role' para que muestre el nombre del rol
    role = serializers.SlugRelatedField(slug_field='name', queryset=Role.objects.all(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active', 'fecha_nacimiento')

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este email ya está registrado.")]
    )
    username = serializers.CharField(
        required=True,
        min_length=3,
        max_length=30,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este nombre de usuario ya está en uso.")]
    )
    first_name = serializers.CharField(
        required=True,
        min_length=2,
        max_length=50,
        validators=[RegexValidator(r'^[a-zA-Z\s]+$', message="El nombre solo puede contener letras y espacios.")]
    )
    last_name = serializers.CharField(
        required=True,
        min_length=2,
        max_length=50,
        validators=[RegexValidator(r'^[a-zA-Z\s]+$', message="El apellido solo puede contener letras y espacios.")]
    )
    fecha_nacimiento = serializers.DateField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    is_staff = serializers.BooleanField(default=False)
    groups = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        many=True,
        required=False
    )
    role = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'fecha_nacimiento', 'role', 'is_staff', 'groups')
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True},
        }

    def validate_password(self, value):
        try:
            django_validate_password(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def validate_fecha_nacimiento(self, value):
        today = timezone.now().date()
        if value > today:
            raise serializers.ValidationError("La fecha de nacimiento no puede ser en el futuro.")
        
        # Calcular edad
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 14:
            raise serializers.ValidationError("Debes tener al menos 14 años para registrarte.")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return data

class AdminRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este email ya está registrado.")]
    )
    username = serializers.CharField(
        required=True,
        min_length=3,
        max_length=30,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este nombre de usuario ya está en uso.")]
    )
    first_name = serializers.CharField(
        required=True,
        min_length=2,
        max_length=50,
        validators=[RegexValidator(r'^[a-zA-Z\s]+$', message="El nombre solo puede contener letras y espacios.")]
    )
    last_name = serializers.CharField(
        required=True,
        min_length=2,
        max_length=50,
        validators=[RegexValidator(r'^[a-zA-Z\s]+$', message="El apellido solo puede contener letras y espacios.")]
    )
    fecha_nacimiento = serializers.DateField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    role = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'fecha_nacimiento', 'role', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True},
            'is_staff': {'default': True},
            'is_superuser': {'default': True},
            'groups': {'required': False},
            'user_permissions': {'required': False},
        }

    def validate_password(self, value):
        try:
            django_validate_password(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def validate_fecha_nacimiento(self, value):
        today = timezone.now().date()
        if value > today:
            raise serializers.ValidationError("La fecha de nacimiento no puede ser en el futuro.")
        
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 14:
            raise serializers.ValidationError("Debes tener al menos 14 años para registrarte.")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(**validated_data)
            
        return user

class PerfilSocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilSocial
        fields = ('id', 'user', 'provider', 'uid', 'extra_data')

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'fecha_nacimiento')
        extra_kwargs = {
            'email': {'required': False},
            'username': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'fecha_nacimiento': {'required': False},
        }
