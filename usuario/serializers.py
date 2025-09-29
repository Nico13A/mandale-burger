from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from .models import Profile, CocineroDelDia
from datetime import date


# ======================
# Base para creación de usuarios
# ======================
class BaseUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está en uso.")
        return value

    def create_user_with_group(self, validated_data, group_name, image=None):
        password = validated_data.pop('password')
        user = User(**validated_data)
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
# Registro normal (Clientes)
# ======================
class RegisterUserSerializer(BaseUserSerializer):
    def create(self, validated_data):
        return self.create_user_with_group(validated_data, "Client")


# ======================
# Registro de cocineros (solo Admin)
# ======================
class CreateCocineroSerializer(BaseUserSerializer):
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
# Visualización del perfil
# ======================
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['image', 'formacion']


# ======================
# Usuario actual
# ======================
class CurrentUserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    profile = ProfileSerializer(read_only=True)  

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups', 'profile']

    def get_groups(self, obj):
        return list(obj.groups.values_list('name', flat=True))


# ======================
# Cocinero (para listados)
# ======================
class CocineroSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile']


# ======================
# Actualizar solo la foto de perfil
# ======================
class ProfileImageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['image']


# ======================
# Actualización de usuario (solo admin)
# ======================
class AdminUserUpdateSerializer(serializers.ModelSerializer):
    formacion = serializers.CharField(source="profile.formacion", required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'formacion']

    def validate_email(self, value):
        if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Este email ya está en uso.")
        return value

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


# ======================
# Crea el cocinero del día
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
        # Desactivar cualquier cocinero activo del día
        CocineroDelDia.objects.filter(fecha=hoy, activo=True).update(activo=False)

        # Crear el nuevo cocinero del día
        cocinero = validated_data['cocinero_id']
        return CocineroDelDia.objects.create(cocinero=cocinero, activo=True, fecha=hoy)

# ======================
# Obtiene el cocinero del día
# ======================
class CocineroDelDiaSerializer(serializers.ModelSerializer):
    cocinero = CocineroSerializer(read_only=True)

    class Meta:
        model = CocineroDelDia
        fields = ['id', 'cocinero', 'fecha', 'activo']

