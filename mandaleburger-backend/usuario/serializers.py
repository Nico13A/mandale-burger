from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from .models import Profile, CocineroDelDia
from datetime import date
import re

# ======================
# Serializers de Perfil (Profile)
# ======================
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['image', 'formacion']


class ProfileImageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['image']


# ======================
# Serializer Base de Usuario
# ======================
class BaseUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    # Validación de contraseña
    def validate_password(self, value):
        if value:  
            try:
                validate_password(value)
            except ValidationError as e:
                raise serializers.ValidationError(e.messages)
        return value

    # Validación de email
    def validate_email(self, value):
        qs = User.objects.filter(email=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError("Este email ya está en uso.")
        return value

    # Validación de nombres (solo letras y espacios)
    def validate_first_name(self, value):
        if not re.match(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$', value):
            raise serializers.ValidationError("El nombre solo puede contener letras y espacios.")
        return value

    def validate_last_name(self, value):
        if not re.match(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$', value):
            raise serializers.ValidationError("El apellido solo puede contener letras y espacios.")
        return value

    # Crear usuario con grupo
    def create_user_with_group(self, validated_data, group_name, image=None):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()

        group = Group.objects.get(name=group_name)
        user.groups.add(group)

        profile = Profile.objects.create(user=user)
        if image:
            profile.image = image
            profile.save()
        return user


# ======================
# Serializers de Registro
# ======================
class RegisterUserSerializer(BaseUserSerializer):  # Clientes
    def create(self, validated_data):
        return self.create_user_with_group(validated_data, "Client")


class CreateCocineroSerializer(BaseUserSerializer):  # Cocineros (solo Admin)
    image = serializers.ImageField(write_only=True, required=False)
    formacion = serializers.CharField(write_only=True, required=False)

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + ['image', 'formacion']

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        formacion = validated_data.pop('formacion', None)
        user = self.create_user_with_group(validated_data, "Cook", image=image)
        if formacion:
            user.profile.formacion = formacion
            user.profile.save()
        return user


# ======================
# Serializers de Visualización
# ======================
class CurrentUserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'groups', 'profile']

    def get_groups(self, obj):
        return list(obj.groups.values_list('name', flat=True))


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_active']


class CocineroSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile']


# ======================
# Serializers de Actualización
# ======================
class AdminUserUpdateSerializer(BaseUserSerializer):
    formacion = serializers.CharField(source="profile.formacion", required=False)

    class Meta(BaseUserSerializer.Meta):
        fields = ['first_name', 'last_name', 'email', 'formacion']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        formacion = profile_data.get('formacion')
        if formacion is not None:
            instance.profile.formacion = formacion
            instance.profile.save()
        return instance


class ClienteUpdateSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = ['first_name', 'last_name', 'email']


# ======================
# Serializers de Cocinero del Día
# ======================
class CocineroDelDiaCreateSerializer(serializers.ModelSerializer):
    cocinero_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name='Cook', is_active=True),
        write_only=True
    )

    class Meta:
        model = CocineroDelDia
        fields = ['cocinero_id']

    def create(self, validated_data):
        hoy = date.today()
        CocineroDelDia.objects.filter(fecha=hoy, activo=True).update(activo=False)
        cocinero = validated_data['cocinero_id']
        return CocineroDelDia.objects.create(cocinero=cocinero, activo=True, fecha=hoy)


class CocineroDelDiaSerializer(serializers.ModelSerializer):
    cocinero = CocineroSerializer(read_only=True)

    class Meta:
        model = CocineroDelDia
        fields = ['id', 'cocinero', 'fecha', 'activo']


# ======================
# Serializer para editar mi propio perfil
# ======================
class UserProfileUpdateSerializer(BaseUserSerializer):
    formacion = serializers.CharField(source="profile.formacion", required=False)

    class Meta(BaseUserSerializer.Meta):
        fields = ['username', 'first_name', 'last_name', 'email', 'formacion']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})

        # Actualiza username, first_name, last_name, email
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Solo si el usuario es cocinero, permite actualizar formacion
        if instance.groups.filter(name="Cook").exists():
            formacion = profile_data.get('formacion')
            if formacion is not None:
                instance.profile.formacion = formacion
                instance.profile.save()

        return instance


# ======================
# Serializer para cambiar contraseña
# ======================
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def validate(self, attrs):
        user = self.context['request'].user
        current_password = attrs.get('current_password')
        new_password = attrs.get('new_password')
        if not user.check_password(current_password):
            raise serializers.ValidationError({'current_password': 'La contraseña actual es incorrecta.'})
        if current_password == new_password:
            raise serializers.ValidationError({'new_password': 'La nueva contraseña no puede ser igual a la actual.'})
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user
