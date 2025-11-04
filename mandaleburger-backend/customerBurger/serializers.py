from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import CustomBurger, CustomIngredient, CustomBurgerUsuario
from core.models import Ingredient

User = get_user_model()

# -------------------------
# Serializer de CustomIngredient
# -------------------------
class CustomIngredientSerializer(serializers.ModelSerializer):
    ingredient_id = serializers.PrimaryKeyRelatedField(
        queryset=Ingredient.objects.all(),
        write_only=True,
        source='ingredient'
    )
    ingredient = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = CustomIngredient
        fields = ['id', 'ingredient', 'ingredient_id', 'quantity']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0.")
        return value

    def validate(self, data):
        ingredient = data.get('ingredient')

        if not ingredient:
            ingredient_id = self.initial_data.get('ingredient_id')
            if ingredient_id:
                try:
                    ingredient = Ingredient.objects.get(id=ingredient_id)
                except Ingredient.DoesNotExist:
                    raise serializers.ValidationError({"ingredient_id": "El ingrediente no existe."})

        
        if not getattr(ingredient, 'is_active', True):
            raise serializers.ValidationError(
                {"ingredient_id": f"El ingrediente '{ingredient.name}' está inactivo y no puede usarse."}
            )

        stock = getattr(ingredient, 'stock', None)
        if stock is not None and stock <= 0:
            raise serializers.ValidationError(
                {"ingredient_id": f"El ingrediente '{ingredient.name}' no tiene stock disponible."}
            )

        return data


# -------------------------
# Serializer de CustomBurger
# -------------------------
class CustomBurgerSerializer(serializers.ModelSerializer):
    ingredients = CustomIngredientSerializer(many=True, read_only=True)
    ingredients_data = CustomIngredientSerializer(
        many=True, write_only=True, required=False, allow_empty=True
    )
    is_active = serializers.BooleanField(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = CustomBurger
        fields = [
            'id',
            'custom_name',
            'description', 
            'img',
            'total_price',
            'is_active',
            'user_id',
            'username',
            'ingredients',
            'ingredients_data',
        ]

    def _get_ingredients_payload(self):
        if 'ingredients_data' not in self.initial_data:
            return None
        ingredient_data = self.initial_data.get('ingredients_data')
        if isinstance(ingredient_data, str):
            import json
            try:
                ingredient_data = json.loads(ingredient_data or "[]")
            except Exception:
                raise ValidationError({"ingredients_data": "JSON inválido."})
        return ingredient_data

    def create(self, validated_data):
        validated_data.pop('is_active', None)

        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            raise ValidationError({"user": "Debes estar autenticado para crear la burger."})

        # Creamos la burger con el total que viene del front (por compatibilidad)
        burger = CustomBurger.objects.create(user=request.user, **validated_data)

        # Ingredientes
        ingredient_data = self._get_ingredients_payload()
        if not ingredient_data:
            burger.delete()
            raise ValidationError({"ingredients_data": "Debe incluir al menos un ingrediente."})

        total = 0
        try:
            for item in ingredient_data:
                cis = CustomIngredientSerializer(data=item)
                cis.is_valid(raise_exception=True)
                ingrediente = cis.validated_data['ingredient']
                cantidad = cis.validated_data['quantity']

                # Crear la relación ingrediente <-> burger
                CustomIngredient.objects.create(custom_burger=burger, **cis.validated_data)

                # Calcular el total con el precio real desde la BD
                if hasattr(ingrediente, 'price'):
                    total += ingrediente.price * cantidad
                else:
                    burger.delete()
                    raise ValidationError(
                        {"ingredients_data": f"El ingrediente '{ingrediente}' no tiene campo 'price' definido."}
                    )

            # Sobrescribimos el total_price con el valor calculado real
            burger.total_price = total
            burger.save()

        except Exception:
            burger.delete()
            raise

        return burger


    def update(self, instance, validated_data):
        validated_data.pop('is_active', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar ingredientes (opcional)
        ingredient_data = self._get_ingredients_payload()
        if ingredient_data:
            instance.ingredients.all().delete()
            for item in ingredient_data:
                cis = CustomIngredientSerializer(data=item)
                cis.is_valid(raise_exception=True)
                CustomIngredient.objects.create(custom_burger=instance, **cis.validated_data)

        return instance


# -------------------------
# Serializer de relación CustomBurgerUsuario
# -------------------------
class CustomBurgerUsuarioSerializer(serializers.ModelSerializer):
    custom_burger = CustomBurgerSerializer(read_only=True)
    usuario = serializers.StringRelatedField(read_only=True)

    custom_burger_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomBurger.objects.all(),
        write_only=True,
        source='custom_burger'
    )
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='usuario'
    )

    class Meta:
        model = CustomBurgerUsuario
        fields = [
            'id',
            'custom_burger', 'custom_burger_id',
            'usuario', 'usuario_id',
        ]

    def validate(self, attrs):
        burger = attrs.get('custom_burger')
        user = attrs.get('usuario')

        if CustomBurgerUsuario.objects.filter(
            custom_burger=burger,
            usuario=user
        ).exists():
            raise ValidationError("Esta burger ya está asociada a este usuario.")

        return attrs
