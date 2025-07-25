import random
import jwt
from datetime import datetime, timedelta

from django.utils import timezone
from django.conf import settings
from django.contrib.auth import login, logout
from django.http import JsonResponse
from django.db import models

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import User, Role, UserRole, OTP, AuditLog
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserRoleSerializer,
    AuditLogSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    AdminUserListSerializer,
    AdminUserUpdateSerializer,
)
from .permissions import IsAdmin
from django.core.mail import send_mail
import secrets

# JWT helpers
def generate_access_token(user):
    payload = {
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(minutes=15),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")

def generate_refresh_token(user):
    payload = {
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")

# --- API Views ---

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {
                "message": "User registered successfully",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_list_users(request):
    query = request.GET.get("q", "")
    user_type = request.GET.get("user_type", None)
    users = User.objects.all()
    if query:
        users = users.filter(
            models.Q(username__icontains=query) |
            models.Q(email__icontains=query) |
            models.Q(phone_number__icontains=query)
        )
    if user_type:
        users = users.filter(user_type=user_type)
    serializer = AdminUserListSerializer(users, many=True)
    return Response(serializer.data)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    serializer = AdminUserUpdateSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_deactivate_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    user.is_active = False
    user.save()
    return Response({"message": "User deactivated"})

# Email verification endpoints
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_verification_email(request):
    user = request.user
    if user.is_email_verified:
        return Response({"message": "Email already verified."}, status=200)
    token = secrets.token_urlsafe(32)
    user.email_verification_token = token
    user.save()
    verification_link = f"http://localhost:8000/email/verify/?email={user.email}&token={token}"
    send_mail(
        "Verify your email",
        f"Click the link to verify your email: {verification_link}",
        settings.EMAIL_HOST_USER,
        [user.email],
        fail_silently=False,
    )
    return Response({"message": "Verification email sent."})

@api_view(["POST"])
@permission_classes([AllowAny])
def verify_email(request):
    email = request.data.get("email")
    token = request.data.get("token")
    try:
        user = User.objects.get(email=email, email_verification_token=token)
    except User.DoesNotExist:
        return Response({"error": "Invalid token or email."}, status=400)
    user.is_email_verified = True
    user.email_verification_token = None
    user.save()
    return Response({"message": "Email verified successfully."})

# Enforce email verification for login
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        if not user.is_email_verified:
            return Response({"error": "Email not verified."}, status=403)
        login(request, user)
        access_token = generate_access_token(user)
        refresh_token = generate_refresh_token(user)
        response = JsonResponse(
            {
                "message": "Login successful",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age=15 * 60,
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )
        # CSRF cookie
        response.set_cookie(
            key="X-CSRFToken",
            value=request.META.get("CSRF_COOKIE", secrets.token_urlsafe(16)),
            httponly=False,
            secure=True,
            samesite="Lax",
        )
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return response

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Profile updated successfully", "user": serializer.data},
            status=status.HTTP_200_OK,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = PasswordChangeSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        if user.check_password(serializer.validated_data["old_password"]):
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response(
                {"message": "Password changed successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Invalid old password"}, status=status.HTTP_400_BAD_REQUEST
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def request_otp(request):
    """Request OTP for phone verification."""
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        phone_number = serializer.validated_data["phone_number"]
        otp_code = str(random.randint(100000, 999999))

        print(f"\n[DEBUG] PHONE VERIFICATION OTP for {phone_number}: {otp_code}\n")

        try:
            user = User.objects.get(phone_number=phone_number)
        except User.DoesNotExist:
            # Optionally, create a dummy user or log it silently
            user = None

        OTP.objects.create(
    user=user,
    otp_code=otp_code,
    phone_number=phone_number,
    purpose="verify",  # ✅ change from "phone_verification" to "verify"
    expires_at=timezone.now() + timedelta(minutes=10),
    is_used=False
)


        # Send success message regardless of user existence
        return Response(
            {"message": "OTP sent successfully (check terminal output)"},
            status=status.HTTP_200_OK
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    """Verify OTP for phone verification."""
    phone_number = request.data.get("phone_number")
    otp_code = request.data.get("otp_code")

    if not phone_number or not otp_code:
        return Response(
            {"error": "Phone number and OTP are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    otp = OTP.objects.filter(
        phone_number=phone_number,
        otp_code=otp_code,
        purpose="verify",  # FIXED: this must match the model choice
        is_used=False,
        expires_at__gt=timezone.now()
    ).first()

    if otp:
        otp.is_used = True
        otp.save()
        return Response(
            {"message": "OTP verified successfully. Proceed to register."},
            status=status.HTTP_200_OK
        )

    return Response(
        {"error": "Invalid or expired OTP"},
        status=status.HTTP_400_BAD_REQUEST
    )



# ✅ Password Reset OTP Request
@api_view(["POST"])
@permission_classes([AllowAny])
def request_password_reset_otp(request):
    phone_number = request.data.get("phone_number")
    if not phone_number:
        return Response({"error": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(phone_number=phone_number)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    otp_code = str(random.randint(100000, 999999))

    OTP.objects.create(
        user=user,
        otp_code=otp_code,
        purpose="password_reset",  # ✅ Correct purpose
        is_used=False,
        expires_at=timezone.now() + timezone.timedelta(minutes=5)
    )

    print(f"\n[DEBUG] PASSWORD RESET OTP for {phone_number}: {otp_code}\n")  # ✅ Updated debug message

    return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)


# ✅ Reset Password
@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)

    if serializer.is_valid():
        phone_number = request.data.get("phone_number")
        otp_code = serializer.validated_data["otp_code"]
        new_password = serializer.validated_data["new_password"]

        try:
            user = User.objects.get(phone_number=phone_number)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        otp = OTP.objects.filter(
            user__phone_number=phone_number,
            otp_code=otp_code,
            purpose="password_reset",  # ✅ Ensure matching purpose
            is_used=False,
            expires_at__gt=timezone.now()
        ).first()

        print(f"[DEBUG] OTP matched in DB: {otp}")  # ✅ Print OTP object or None

        if otp:
            user.set_password(new_password)
            user.is_phone_verified = True
            user.save()

            otp.is_used = True
            otp.save()

            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_roles(request):
    user_roles = UserRole.objects.filter(user=request.user)
    serializer = UserRoleSerializer(user_roles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assign_role(request):
    user_id = request.data.get("user_id")
    role_id = request.data.get("role_id")
    if not user_id or not role_id:
        return Response(
            {"error": "User ID and Role ID required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        user = User.objects.get(id=user_id)
        role = Role.objects.get(id=role_id)
        user_role = UserRole.objects.create(
            user=user, role=role, assigned_by=request.user
        )
        serializer = UserRoleSerializer(user_role)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except (User.DoesNotExist, Role.DoesNotExist):
        return Response(
            {"error": "User or Role not found"}, status=status.HTTP_404_NOT_FOUND
        )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def audit_logs(request):
    logs = AuditLog.objects.filter(user=request.user).order_by("-created_at")
    serializer = AuditLogSerializer(logs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
