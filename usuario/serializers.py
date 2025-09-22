from rest_framework import serializers
from django.contrib.auth.models import User, Group
#from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
#from rest_framework.exceptions import AuthenticationFailed

class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        client_group = Group.objects.get(name='Client')
        user.groups.add(client_group)
        return user
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está en uso.")
        return value


class CurrentUserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups']

    def get_groups(self, obj):
        return list(obj.groups.values_list('name', flat=True))
    

#class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#    def validate(self, attrs):
#        try:
#            data = super().validate(attrs)
#        except AuthenticationFailed:
#            raise AuthenticationFailed('Usuario o contraseña incorrectos')
#        return data