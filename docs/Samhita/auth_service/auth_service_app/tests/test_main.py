from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from auth_service_app.models import Role, UserRole, OTP

User = get_user_model()

class AuthServiceTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.profile_url = reverse('auth-profile')
        self.change_password_url = reverse('auth-change-password')
        self.request_otp_url = reverse('auth-request-otp')
        self.verify_otp_url = reverse('auth-verify-otp')
        self.reset_password_url = reverse('auth-reset-password')
        self.user_roles_url = reverse('auth-user-roles')
        self.assign_role_url = reverse('auth-assign-role')
        self.audit_logs_url = reverse('auth-audit-logs')
        self.user_data = {
            "username": "john",
            "email": "john@email.com",
            "phone_number": "+919876543210",
            "password": "StrongPass123!",
            "user_type": "patient"
        }
        self.admin_user = User.objects.create_user(
            username="admin", email="admin@email.com", phone_number="+911234567890", password="AdminPass123!", user_type="admin"
        )

    def test_register(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_and_cookie(self):
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.login_url, {"username": "john", "password": "StrongPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Set-Cookie', response._headers)

    def test_profile_requires_auth(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password(self):
        self.client.post(self.register_url, self.user_data, format='json')
        self.client.post(self.login_url, {"username": "john", "password": "StrongPass123!"}, format='json')
        user = User.objects.get(username="john")
        self.client.force_authenticate(user=user)
        response = self.client.post(self.change_password_url, {"old_password": "StrongPass123!", "new_password": "NewPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_request_otp(self):
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.request_otp_url, {"phone_number": "+919876543210"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_verify_otp(self):
        self.client.post(self.register_url, self.user_data, format='json')
        user = User.objects.get(username="john")
        OTP.objects.create(user=user, otp_code="123456", expires_at="2099-01-01T00:00:00Z")
        response = self.client.post(self.verify_otp_url, {"phone_number": "+919876543210", "otp_code": "123456"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_password(self):
        self.client.post(self.register_url, self.user_data, format='json')
        user = User.objects.get(username="john")
        OTP.objects.create(user=user, otp_code="123456", expires_at="2099-01-01T00:00:00Z")
        response = self.client.post(self.reset_password_url, {"phone_number": "+919876543210", "otp_code": "123456", "new_password": "ResetPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_roles(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.user_roles_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_assign_role(self):
        self.client.force_authenticate(user=self.admin_user)
        role = Role.objects.create(name="TestRole")
        user = User.objects.create_user(username="testuser", email="test@email.com", phone_number="+911111111111", password="TestPass123!", user_type="patient")
        response = self.client.post(self.assign_role_url, {"user_id": user.id, "role_id": role.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_audit_logs(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.audit_logs_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
