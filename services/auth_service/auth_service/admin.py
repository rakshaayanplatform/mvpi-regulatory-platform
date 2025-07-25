from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Role, UserRole, OTP, AuditLog

User = get_user_model()

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "phone_number", "user_type", "is_phone_verified", "created_at")
    search_fields = ("username", "email", "phone_number")
    list_filter = ("user_type", "is_phone_verified")

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "created_at")
    search_fields = ("name",)

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "role", "assigned_by", "assigned_at")
    search_fields = ("user__username", "role__name")

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "otp_code", "is_used", "created_at", "expires_at")
    search_fields = ("user__username", "otp_code")
    list_filter = ("is_used",)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "action", "resource_type", "resource_id", "ip_address", "created_at")
    search_fields = ("user__username", "action", "resource_type", "resource_id")
    list_filter = ("action",) 