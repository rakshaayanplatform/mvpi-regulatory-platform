from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
import random
import string
from .models import User, Role, UserRole, OTP, AuditLog
from .serializers import (
    UserSerializer, UserRegistrationSerializer, LoginSerializer,
    RoleSerializer, UserRoleSerializer, OTPSerializer,
    OTPRequestSerializer, OTPVerifySerializer, PasswordResetSerializer,
    AuditLogSerializer
)


class RegisterView(APIView):
    """User registration endpoint."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create audit log
            AuditLog.objects.create(
                user=user,
                action='create',
                resource_type='user',
                resource_id=str(user.id),
                ip_address=request.META.get('REMOTE_ADDR', ''),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                details={'registration_method': 'api'}
            )
            
            return Response({
                'message': 'User registered successfully.',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """User login endpoint."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Create audit log
            AuditLog.objects.create(
                user=user,
                action='login',
                resource_type='user',
                resource_id=str(user.id),
                ip_address=request.META.get('REMOTE_ADDR', ''),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                details={'login_method': 'api'}
            )
            
            return Response({
                'access_token': str(access_token),
                'refresh_token': str(refresh),
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """User logout endpoint."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Create audit log
            AuditLog.objects.create(
                user=request.user,
                action='logout',
                resource_type='user',
                resource_id=str(request.user.id),
                ip_address=request.META.get('REMOTE_ADDR', ''),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                details={'logout_method': 'api'}
            )
            
            return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class OTPRequestView(APIView):
    """Request OTP for phone verification."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            user = User.objects.get(phone_number=phone_number)
            
            # Generate OTP
            otp_code = ''.join(random.choices(string.digits, k=6))
            expires_at = timezone.now() + timedelta(minutes=10)
            
            # Create OTP record
            OTP.objects.create(
                user=user,
                otp_code=otp_code,
                expires_at=expires_at
            )
            
            # TODO: Send OTP via SMS/WhatsApp
            # For development, we'll return the OTP in response
            return Response({
                'message': 'OTP sent successfully.',
                'otp_code': otp_code  # Remove this in production
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerifyView(APIView):
    """Verify OTP for phone verification."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            otp = serializer.validated_data['otp']
            
            # Mark OTP as used
            otp.is_used = True
            otp.save()
            
            # Mark user as phone verified
            user.is_phone_verified = True
            user.save()
            
            # Create audit log
            AuditLog.objects.create(
                user=user,
                action='update',
                resource_type='user',
                resource_id=str(user.id),
                ip_address=request.META.get('REMOTE_ADDR', ''),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                details={'verification_type': 'phone_otp'}
            )
            
            return Response({
                'message': 'Phone number verified successfully.'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    """Reset password using OTP."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            otp_code = serializer.validated_data['otp_code']
            new_password = serializer.validated_data['new_password']
            
            try:
                user = User.objects.get(phone_number=phone_number)
                otp = OTP.objects.filter(
                    user=user,
                    otp_code=otp_code,
                    is_used=False,
                    expires_at__gt=timezone.now()
                ).first()
                
                if not otp:
                    return Response({
                        'error': 'Invalid or expired OTP.'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Update password
                user.set_password(new_password)
                user.save()
                
                # Mark OTP as used
                otp.is_used = True
                otp.save()
                
                # Create audit log
                AuditLog.objects.create(
                    user=user,
                    action='update',
                    resource_type='user',
                    resource_id=str(user.id),
                    ip_address=request.META.get('REMOTE_ADDR', ''),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    details={'reset_method': 'otp'}
                )
                
                return Response({
                    'message': 'Password reset successfully.'
                }, status=status.HTTP_200_OK)
            
            except User.DoesNotExist:
                return Response({
                    'error': 'User not found.'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """Get and update user profile."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoleListView(generics.ListCreateAPIView):
    """List and create roles."""
    
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAdminUser]


class UserRoleView(APIView):
    """Assign roles to users."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request):
        user_id = request.data.get('user_id')
        role_id = request.data.get('role_id')
        
        try:
            user = User.objects.get(id=user_id)
            role = Role.objects.get(id=role_id)
            
            user_role, created = UserRole.objects.get_or_create(
                user=user,
                role=role,
                defaults={'assigned_by': request.user}
            )
            
            if not created:
                return Response({
                    'message': 'Role already assigned to user.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({
                'message': 'Role assigned successfully.'
            }, status=status.HTTP_201_CREATED)
        
        except (User.DoesNotExist, Role.DoesNotExist):
            return Response({
                'error': 'User or role not found.'
            }, status=status.HTTP_404_NOT_FOUND)


class AuditLogView(generics.ListAPIView):
    """List audit logs."""
    
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = AuditLog.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset 