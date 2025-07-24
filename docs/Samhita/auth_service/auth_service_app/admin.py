from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import Role, UserRole, OTP, AuditLog

User = get_user_model()

try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass


@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    list_display = ("id", "username", "email", "phone_number", "user_type", "is_phone_verified", "created_at")
    search_fields = ("username", "email", "phone_number")
    list_filter = ("user_type", "is_phone_verified")

    fieldsets = DefaultUserAdmin.fieldsets + (
        ("Additional Info", {
            "fields": (
                "phone_number", "user_type", "is_phone_verified",
                "organization_name", "designation", "address"
            )
        }),
    )


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
    list_display = ("id", "user", "phone_number", "otp_code", "is_used", "created_at", "expires_at")
    search_fields = ("user__username", "phone_number", "otp_code")
    list_filter = ("is_used",)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "action", "resource_type", "resource_id", "ip_address", "created_at")
    search_fields = ("user__username", "action", "resource_type", "resource_id")
    list_filter = ("action",)
