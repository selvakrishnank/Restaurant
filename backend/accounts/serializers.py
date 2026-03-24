from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, role=role)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
     try:
        user_obj = User.objects.get(email=data['username'])
     except User.DoesNotExist:
        raise serializers.ValidationError("Invalid credentials")

     user = authenticate(username=user_obj.username, password=data['password'])

     if not user:
        raise serializers.ValidationError("Invalid credentials")

     profile = Profile.objects.get(user=user)

     return {
        "username": user.username,
        "email": user.email,
        "role": profile.role
    }

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):

        # Allow login using email
        try:
            user_obj = User.objects.get(email=attrs['username'])
        except User.DoesNotExist:
            raise serializers.ValidationError("No active account found with the given credentials")

        attrs['username'] = user_obj.username

        # Get default token response
        data = super().validate(attrs)

        # Get profile
        profile = Profile.objects.get(user=self.user)

        # Add extra fields
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['role'] = profile.role

        return data