from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import re

class User(AbstractUser):
    """Custom User model for Rakshaayan platform."""
    USER_TYPE_CHOICES = [
        ("patient", "Patient"),
        ("hospital", "Hospital Staff"),
        ("manufacturer", "Manufacturer"),
        ("government", "Government Official"),
        ("coordinator", "MDMC Coordinator"),
        ("admin", "System Administrator"),
    ]
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    phone_number = models.CharField(max_length=15, unique=True)
    is_phone_verified = models.BooleanField(default=False)
    organization_name = models.CharField(max_length=200, blank=True)
    designation = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "auth_users"
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

    def clean(self):
        # Username regex
        if not re.match(r'^[\w.@+-]+$', self.username):
            raise ValueError("Invalid username format.")
        # Email validation
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", self.email):
            raise ValueError("Invalid email format.")
        # Phone regex (E.164)
        if not re.match(r"^\+?\d{10,15}$", self.phone_number):
            raise ValueError("Invalid phone number format.")

class Role(models.Model):
    """Role-based permissions for different user types."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "auth_roles"

    def __str__(self):
        return self.name

class UserRole(models.Model):
    """Many-to-many relationship between User and Role."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)
    assigned_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="role_assignments"
    )

    class Meta:
        db_table = "auth_user_roles"
        unique_together = ("user", "role")

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"

class OTP(models.Model):
    """One-Time Password for phone verification."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        db_table = "auth_otps"

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"OTP for {self.user.username}"

class AuditLog(models.Model):
    """Audit trail for user actions."""
    ACTION_CHOICES = [
        ("login", "Login"),
        ("logout", "Logout"),
        ("create", "Create"),
        ("update", "Update"),
        ("delete", "Delete"),
        ("view", "View"),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    resource_type = models.CharField(max_length=100)
    resource_id = models.CharField(max_length=100, blank=True)
    details = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "auth_audit_logs"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.action} - {self.created_at}"
