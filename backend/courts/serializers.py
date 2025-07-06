from rest_framework import serializers
from .models import Court, CourtImage # Importar CourtImage

class CourtImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourtImage
        fields = ['id', 'image'] # Campos del serializador de imagen

class CourtSerializer(serializers.ModelSerializer):
    images = CourtImageSerializer(many=True, read_only=True) # Campo para las imágenes, read_only para la representación

    class Meta:
        model = Court
        fields = ['id', 'name', 'description', 'price', 'is_active', 'images'] # Incluir 'images' en los campos

    def validate(self, data):
        """
        Valida los campos 'name', 'description' y 'price'.
        Asegura que los campos de texto no estén vacíos y que el precio sea un número positivo.
        """
        # Validar que 'name' no esté vacío o solo espacios en blanco
        name = data.get('name')
        if not name or not name.strip():
            raise serializers.ValidationError({"name": "El nombre de la cancha no puede estar vacío."})
        data['name'] = name.strip() # Limpiar espacios en blanco

        # Validar que 'description' no esté vacío o solo espacios en blanco
        description = data.get('description')
        if not description or not description.strip():
            raise serializers.ValidationError({"description": "La descripción no puede estar vacía."})
        data['description'] = description.strip() # Limpiar espacios en blanco

        # Validar que 'price' sea un número positivo
        price = data.get('price')
        if price is None:
            raise serializers.ValidationError({"price": "El precio es obligatorio."})
        if not isinstance(price, (int, float)):
            try:
                price = float(price) # Intentar convertir a float si no es ya un número
            except ValueError:
                raise serializers.ValidationError({"price": "El precio debe ser un número válido."})
        
        if price <= 0:
            raise serializers.ValidationError({"price": "El precio debe ser un número positivo."})
        data['price'] = price # Asegurar que el precio sea un número en los datos validados

        return data

    def create(self, validated_data):
        # Lógica para crear la cancha y manejar las imágenes asociadas
        # Las imágenes se manejarán en la vista, no directamente en el serializador de creación de la cancha principal
        # Este serializador se usará principalmente para listar y actualizar (si se implementa)
        return Court.objects.create(**validated_data)
