from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from .models import User, Role, UserRole, OTP, AuditLog


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'phone_number', 'is_phone_verified',
            'organization_name', 'designation', 'address',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'confirm_password',
            'first_name', 'last_name', 'user_type', 'phone_number',
            'organization_name', 'designation', 'address'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password.')
        
        return attrs


class RoleSerializer(serializers.ModelSerializer):
    """Serializer for Role model."""
    
    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserRoleSerializer(serializers.ModelSerializer):
    """Serializer for UserRole model."""
    
    user = UserSerializer(read_only=True)
    role = RoleSerializer(read_only=True)
    
    class Meta:
        model = UserRole
        fields = ['id', 'user', 'role', 'assigned_at', 'assigned_by']
        read_only_fields = ['id', 'assigned_at']


class OTPSerializer(serializers.ModelSerializer):
    """Serializer for OTP model."""
    
    class Meta:
        model = OTP
        fields = ['id', 'user', 'otp_code', 'is_used', 'created_at', 'expires_at']
        read_only_fields = ['id', 'created_at', 'expires_at']


class OTPRequestSerializer(serializers.Serializer):
    """Serializer for OTP request."""
    
    phone_number = serializers.CharField(max_length=15)
    
    def validate_phone_number(self, value):
        if not User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError('No user found with this phone number.')
        return value


class OTPVerifySerializer(serializers.Serializer):
    """Serializer for OTP verification."""
    
    phone_number = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)
    
    def validate(self, attrs):
        phone_number = attrs.get('phone_number')
        otp_code = attrs.get('otp_code')
        
        try:
            user = User.objects.get(phone_number=phone_number)
            otp = OTP.objects.filter(
                user=user,
                otp_code=otp_code,
                is_used=False,
                expires_at__gt=timezone.now()
            ).first()
            
            if not otp:
                raise serializers.ValidationError('Invalid or expired OTP.')
            
            attrs['user'] = user
            attrs['otp'] = otp
            
        except User.DoesNotExist:
            raise serializers.ValidationError('No user found with this phone number.')
        
        return attrs


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset."""
    
    phone_number = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs


class AuditLogSerializer(serializers.ModelSerializer):
    """Serializer for AuditLog model."""
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'action', 'resource_type', 'resource_id',
            'details', 'ip_address', 'user_agent', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class RefreshTokenSerializer(serializers.Serializer):
    """Serializer for token refresh."""
    
    refresh_token = serializers.CharField()
    
    def validate_refresh_token(self, value):
        # Add JWT refresh token validation logic here
        return value 