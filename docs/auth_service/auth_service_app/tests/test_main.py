from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from auth_service_app.models import Role, UserRole, OTP

User = get_user_model()

class TestAuthService(APITestCase):
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
        user = User.objects.get(username="john")
        # Simulate email verification
        user.is_email_verified = True
        user.save()
        response = self.client.post(self.login_url, {"username": "john", "password": "StrongPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)

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
        OTP.objects.create(user=user, phone_number=user.phone_number, otp_code="123456", purpose="verify", expires_at="2099-01-01T00:00:00Z")
        response = self.client.post(self.verify_otp_url, {"phone_number": "+919876543210", "otp_code": "123456"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_password(self):
        self.client.post(self.register_url, self.user_data, format='json')
        user = User.objects.get(username="john")
        OTP.objects.create(user=user, phone_number=user.phone_number, otp_code="123456", purpose="password_reset", expires_at="2099-01-01T00:00:00Z")
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

    def test_email_verification_flow(self):
        # Register user
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username="john")
        self.client.force_authenticate(user=user)
        # Send verification email
        response = self.client.post(reverse('send-verification-email'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = User.objects.get(username="john").email_verification_token
        # Verify email
        self.client.logout()
        response = self.client.post(reverse('verify-email'), {"email": "john@email.com", "token": token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.is_email_verified)

    def test_admin_user_management(self):
        # Create users
        user1 = User.objects.create_user(username="user1", email="user1@email.com", phone_number="+911111111111", password="User1Pass123!", user_type="patient")
        user2 = User.objects.create_user(username="user2", email="user2@email.com", phone_number="+922222222222", password="User2Pass123!", user_type="hospital")
        self.client.force_authenticate(user=self.admin_user)
        # List users
        response = self.client.get(reverse('admin-list-users'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)
        # Search users
        response = self.client.get(reverse('admin-list-users') + '?q=user1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(u['username'] == 'user1' for u in response.data))
        # Update user
        response = self.client.patch(reverse('admin-update-user', args=[user1.id]), {"user_type": "manufacturer"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Deactivate user
        response = self.client.delete(reverse('admin-deactivate-user', args=[user2.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user2.refresh_from_db()
        self.assertFalse(user2.is_active)

    def test_patient_workflow(self):
        # Register patient
        patient_data = {
            "username": "patient1",
            "email": "patient1@email.com",
            "phone_number": "+911111111111",
            "password": "PatientPass123!",
            "user_type": "patient"
        }
        response = self.client.post(self.register_url, patient_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        patient = User.objects.get(username="patient1")
        # Simulate email verification
        patient.is_email_verified = True
        patient.save()
        # Login
        response = self.client.post(self.login_url, {"username": "patient1", "password": "PatientPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=patient)
        # Update profile
        response = self.client.put(self.profile_url.replace('profile/', 'profile/update/'), {"organization_name": "Patient Org"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Change password
        response = self.client.post(self.change_password_url, {"old_password": "PatientPass123!", "new_password": "NewPatientPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Get roles
        response = self.client.get(self.user_roles_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Try forbidden admin endpoint
        response = self.client.get(reverse('admin-list-users'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # Logout
        self.client.logout()

    def test_hospital_workflow(self):
        hospital_data = {
            "username": "hospital1",
            "email": "hospital1@email.com",
            "phone_number": "+922222222222",
            "password": "HospitalPass123!",
            "user_type": "hospital"
        }
        response = self.client.post(self.register_url, hospital_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        hospital = User.objects.get(username="hospital1")
        hospital.is_email_verified = True
        hospital.save()
        response = self.client.post(self.login_url, {"username": "hospital1", "password": "HospitalPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=hospital)
        response = self.client.put(self.profile_url.replace('profile/', 'profile/update/'), {"organization_name": "Hospital Org"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(self.change_password_url, {"old_password": "HospitalPass123!", "new_password": "NewHospitalPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(self.user_roles_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('admin-list-users'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()

    def test_manufacturer_workflow(self):
        manufacturer_data = {
            "username": "manufacturer1",
            "email": "manufacturer1@email.com",
            "phone_number": "+933333333333",
            "password": "ManufacturerPass123!",
            "user_type": "manufacturer"
        }
        response = self.client.post(self.register_url, manufacturer_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        manufacturer = User.objects.get(username="manufacturer1")
        manufacturer.is_email_verified = True
        manufacturer.save()
        response = self.client.post(self.login_url, {"username": "manufacturer1", "password": "ManufacturerPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=manufacturer)
        response = self.client.put(self.profile_url.replace('profile/', 'profile/update/'), {"organization_name": "Manufacturer Org"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(self.change_password_url, {"old_password": "ManufacturerPass123!", "new_password": "NewManufacturerPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(self.user_roles_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('admin-list-users'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()

    def test_government_workflow(self):
        government_data = {
            "username": "gov1",
            "email": "gov1@email.com",
            "phone_number": "+944444444444",
            "password": "GovPass123!",
            "user_type": "government"
        }
        response = self.client.post(self.register_url, government_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        government = User.objects.get(username="gov1")
        government.is_email_verified = True
        government.save()
        response = self.client.post(self.login_url, {"username": "gov1", "password": "GovPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=government)
        response = self.client.put(self.profile_url.replace('profile/', 'profile/update/'), {"organization_name": "Gov Org"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(self.change_password_url, {"old_password": "GovPass123!", "new_password": "NewGovPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(self.user_roles_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('admin-list-users'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()

    def test_coordinator_workflow(self):
        coordinator_data = {
            "username": "coord1",
            "email": "coord1@email.com",
            "phone_number": "+955555555555",
            "password": "CoordPass123!",
            "user_type": "coordinator"
        }
        response = self.client.post(self.register_url, coordinator_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        coordinator = User.objects.get(username="coord1")
        coordinator.is_email_verified = True
        coordinator.save()
        response = self.client.post(self.login_url, {"username": "coord1", "password": "CoordPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=coordinator)
        response = self.client.put(self.profile_url.replace('profile/', 'profile/update/'), {"organization_name": "Coord Org"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(self.change_password_url, {"old_password": "CoordPass123!", "new_password": "NewCoordPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(self.user_roles_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('admin-list-users'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()

    def test_admin_workflow(self):
        # Admin user already created in setUp
        admin = self.admin_user
        admin.is_email_verified = True
        admin.save()
        response = self.client.post(self.login_url, {"username": "admin", "password": "AdminPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=admin)
        # List users
        response = self.client.get(reverse('admin-list-users'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Update self
        response = self.client.patch(reverse('admin-update-user', args=[admin.id]), {"user_type": "admin"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Deactivate a user
        user = User.objects.create_user(username="to_deactivate", email="to_deactivate@email.com", phone_number="+966666666666", password="ToDeactivate123!", user_type="patient")
        user.is_email_verified = True
        user.save()
        response = self.client.delete(reverse('admin-deactivate-user', args=[user.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertFalse(user.is_active)
        self.client.logout()

    def test_duplicate_registration(self):
        data = {
            "username": "dupuser",
            "email": "dup@email.com",
            "phone_number": "+977777777777",
            "password": "DupPass123!",
            "user_type": "patient"
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Duplicate username
        data2 = data.copy()
        data2["email"] = "other@email.com"
        data2["phone_number"] = "+988888888888"
        response = self.client.post(self.register_url, data2, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Duplicate email
        data3 = data.copy()
        data3["username"] = "otheruser"
        data3["phone_number"] = "+999999999999"
        response = self.client.post(self.register_url, data3, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Duplicate phone
        data4 = data.copy()
        data4["username"] = "anotheruser"
        data4["email"] = "another@email.com"
        response = self.client.post(self.register_url, data4, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_login(self):
        data = {
            "username": "invaliduser",
            "email": "invalid@email.com",
            "phone_number": "+900000000000",
            "password": "InvalidPass123!",
            "user_type": "patient"
        }
        self.client.post(self.register_url, data, format='json')
        user = User.objects.get(username="invaliduser")
        user.is_email_verified = True
        user.save()
        # Wrong password
        response = self.client.post(self.login_url, {"username": "invaliduser", "password": "WrongPass!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Not verified email
        user.is_email_verified = False
        user.save()
        response = self.client.post(self.login_url, {"username": "invaliduser", "password": "InvalidPass123!"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_expired_otp(self):
        data = {
            "username": "otpuser",
            "email": "otp@email.com",
            "phone_number": "+901111111111",
            "password": "OtpPass123!",
            "user_type": "patient"
        }
        self.client.post(self.register_url, data, format='json')
        user = User.objects.get(username="otpuser")
        # Expired OTP
        OTP.objects.create(user=user, phone_number=user.phone_number, otp_code="654321", purpose="verify", expires_at="2000-01-01T00:00:00Z")
        response = self.client.post(self.verify_otp_url, {"phone_number": "+901111111111", "otp_code": "654321"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthorized_access(self):
        # Try to access protected endpoint without login
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # Try to access admin endpoint without login
        response = self.client.get(reverse('admin-list-users'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
