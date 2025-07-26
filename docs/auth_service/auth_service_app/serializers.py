from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Role, UserRole, OTP, AuditLog
import re

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ["password"]
        read_only_fields = ("is_phone_verified", "is_email_verified", "created_at", "updated_at")

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "email", "phone_number", "password", "user_type")

    def validate_username(self, value):
        if not re.match(r'^[\w.@+-]+$', value):
            raise serializers.ValidationError("Invalid username format.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", value):
            raise serializers.ValidationError("Invalid email format.")
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Email already exists.")
        return value.lower()

    def validate_phone_number(self, value):
        if not re.match(r"^\+?\d{10,15}$", value):
            raise serializers.ValidationError("Invalid phone number format.")
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number already exists.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain an uppercase letter.")
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain a lowercase letter.")
        if not re.search(r"\d", value):
            raise serializers.ValidationError("Password must contain a digit.")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise serializers.ValidationError("Password must contain a special character.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
            user_type=validated_data["user_type"],
            password=validated_data["password"],
        )
        user.is_email_verified = False
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")
        if username and password:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid credentials.")
            if not user.check_password(password):
                raise serializers.ValidationError("Invalid credentials.")
            data["user"] = user
        else:
            raise serializers.ValidationError("Must include username and password.")
        return data

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = "__all__"

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = "__all__"
        read_only_fields = ("user", "created_at")

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain an uppercase letter.")
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain a lowercase letter.")
        if not re.search(r"\d", value):
            raise serializers.ValidationError("Password must contain a digit.")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise serializers.ValidationError("Password must contain a special character.")
        return value

class PasswordResetRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField()

    def validate_phone_number(self, value):
        if not re.match(r"^\+?\d{10,15}$", value):
            raise serializers.ValidationError("Invalid phone number format.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    otp_code = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain an uppercase letter.")
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain a lowercase letter.")
        if not re.search(r"\d", value):
            raise serializers.ValidationError("Password must contain a digit.")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise serializers.ValidationError("Password must contain a special character.")
        return value

class AdminUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "phone_number", "user_type", "is_active", "is_email_verified", "is_phone_verified")

class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email", "phone_number", "user_type", "is_active")

class EmailVerificationSendSerializer(serializers.Serializer):
    email = serializers.EmailField()

class EmailVerificationConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField()

# New Admin API Serializers

class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "email", "phone_number", "password", "user_type", "organization_name", "designation", "address")

    def validate_username(self, value):
        if not re.match(r'^[\w.@+-]+$', value):
            raise serializers.ValidationError("Invalid username format.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", value):
            raise serializers.ValidationError("Invalid email format.")
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Email already exists.")
        return value.lower()

    def validate_phone_number(self, value):
        if not re.match(r"^\+?\d{10,15}$", value):
            raise serializers.ValidationError("Invalid phone number format.")
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number already exists.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Password must contain an uppercase letter.")
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Password must contain a lowercase letter.")
        if not re.search(r"\d", value):
            raise serializers.ValidationError("Password must contain a digit.")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise serializers.ValidationError("Password must contain a special character.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
            user_type=validated_data["user_type"],
            password=validated_data["password"],
            organization_name=validated_data.get("organization_name", ""),
            designation=validated_data.get("designation", ""),
            address=validated_data.get("address", ""),
        )
        user.is_email_verified = True  # Admin created users are pre-verified
        user.is_phone_verified = True
        user.save()
        return user

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"

    def validate_name(self, value):
        if Role.objects.filter(name=value).exists():
            raise serializers.ValidationError("Role name already exists.")
        return value

class AdminAuditLogSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = AuditLog
        fields = "__all__"
        read_only_fields = ("user", "created_at")

class SystemConfigSerializer(serializers.Serializer):
    site_name = serializers.CharField(max_length=200)
    maintenance_mode = serializers.BooleanField(default=False)
    registration_enabled = serializers.BooleanField(default=True)
    email_notifications = serializers.BooleanField(default=True)
    backup_frequency = serializers.ChoiceField(choices=[
        ('hourly', 'Hourly'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly')
    ])
    session_timeout = serializers.IntegerField(min_value=5, max_value=1440)
    max_login_attempts = serializers.IntegerField(min_value=1, max_value=10)
    password_policy = serializers.DictField()

class SystemHealthSerializer(serializers.Serializer):
    cpu_usage = serializers.FloatField(min_value=0, max_value=100)
    memory_usage = serializers.FloatField(min_value=0, max_value=100)
    disk_usage = serializers.FloatField(min_value=0, max_value=100)
    uptime = serializers.CharField()
    active_connections = serializers.IntegerField(min_value=0)
    database_status = serializers.CharField()
    cache_status = serializers.CharField()

class UserRoleAssignmentSerializer(serializers.Serializer):
    role_id = serializers.IntegerField()

    def validate_role_id(self, value):
        try:
            Role.objects.get(id=value)
        except Role.DoesNotExist:
            raise serializers.ValidationError("Role does not exist.")
        return value
