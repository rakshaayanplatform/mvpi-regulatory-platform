# Auth Service - Comprehensive Documentation (Samhita)

## Overview
The Auth Service handles user authentication, registration, password and email management, OTP, roles, audit logging, and admin user management for the Rakshaayan platform. It is the central authority for user management and security, supporting all user types (patients, hospitals, manufacturers, government, coordinators, admins).

---

## API Endpoints

| Endpoint           | Method | Description                | Auth Required | Frontend Page(s)         |
|--------------------|--------|----------------------------|--------------|-------------------------|
| /register/         | POST   | Register new user          | No           | /register               |
| /login/            | POST   | Login, set JWT cookies     | No           | /login                  |
| /logout/           | POST   | Logout, clear cookies      | Yes          | (user menu)             |
| /profile/          | GET    | Get user profile           | Yes          | (profile page)          |
| /profile/update/   | PUT    | Update user profile        | Yes          | (profile edit)          |
| /change-password/  | POST   | Change password            | Yes          | (settings)              |
| /request-otp/      | POST   | Request OTP for phone      | No           | /register               |
| /verify-otp/       | POST   | Verify OTP                 | No           | /register               |
| /reset-password/   | POST   | Reset password with OTP    | No           | (forgot pwd)            |
| /request-password-reset-otp/ | POST | Request OTP for password reset | No | (forgot pwd) |
| /user-roles/       | GET    | Get user roles             | Yes          | (admin/settings)        |
| /assign-role/      | POST   | Assign role to user        | Yes (admin)  | (admin)                 |
| /audit-logs/       | GET    | Get audit logs             | Yes          | (admin/audit)           |
| /admin/users/      | GET    | List/search users          | Yes (admin)  | (admin user mgmt)       |
| /admin/users/<id>/ | PATCH  | Update user                | Yes (admin)  | (admin user mgmt)       |
| /admin/users/<id>/deactivate/ | DELETE | Deactivate user | Yes (admin) | (admin user mgmt) |
| /email/send-verification/ | POST | Send verification email | Yes | (profile/settings) |
| /email/verify/     | POST   | Verify email               | No           | (email verify)          |

---

## API Details & Example Requests

### 1. Register
- **POST /register/**
- **Input:**
```json
{
  "username": "john",
  "email": "john@email.com",
  "phone_number": "+919876543210",
  "password": "StrongPass123!",
  "user_type": "patient"
}
```
- **Output:** `201 Created` with user data, or `400 Bad Request` with errors.

### 2. Login (Requires email verification)
- **POST /login/**
- **Input:**
```json
{
  "username": "john",
  "password": "StrongPass123!"
}
```
- **Output:** `200 OK` with user data, sets `access_token` and `refresh_token` cookies. `403` if email not verified.

### 3. Request OTP
- **POST /request-otp/**
- **Input:**
```json
{
  "phone_number": "+919876543210"
}
```
- **Output:** `200 OK` if sent, `404` if user not found.

### 4. Verify OTP
- **POST /verify-otp/**
- **Input:**
```json
{
  "phone_number": "+919876543210",
  "otp_code": "123456"
}
```
- **Output:** `200 OK` if verified, `400/404` if invalid.

### 5. Request Password Reset OTP
- **POST /request-password-reset-otp/**
- **Input:**
```json
{
  "phone_number": "+919876543210"
}
```
- **Output:** `200 OK` if sent, `404` if user not found.

### 6. Reset Password
- **POST /reset-password/**
- **Input:**
```json
{
  "phone_number": "+919876543210",
  "otp_code": "123456",
  "new_password": "ResetPass123!"
}
```
- **Output:** `200 OK` if reset, `400/404` if invalid.

### 7. Change Password
- **POST /change-password/** (auth required)
- **Input:**
```json
{
  "old_password": "StrongPass123!",
  "new_password": "NewPass123!"
}
```
- **Output:** `200 OK` if changed, `400` if invalid.

### 8. Profile
- **GET /profile/** (auth required)
- **Output:** User profile data.

### 9. Update Profile
- **PUT /profile/update/** (auth required)
- **Input:** Partial user fields.
- **Output:** Updated user data.

### 10. User Roles
- **GET /user-roles/** (auth required)
- **Output:** List of roles for the user.

### 11. Assign Role
- **POST /assign-role/** (auth required, admin)
- **Input:**
```json
{
  "user_id": 2,
  "role_id": 1
}
```
- **Output:** Role assignment confirmation.

### 12. Audit Logs
- **GET /audit-logs/** (auth required)
- **Output:** List of audit log entries for the user.

### 13. Admin User Management
- **GET /admin/users/** (admin only): List/search users
- **PATCH /admin/users/<id>/** (admin only): Update user
- **DELETE /admin/users/<id>/deactivate/** (admin only): Deactivate user

### 14. Email Verification
- **POST /email/send-verification/** (auth required): Send verification email
- **POST /email/verify/** (no auth):
```json
{
  "email": "john@email.com",
  "token": "<token-from-email>"
}
```
- **Output:** `200 OK` if verified, `400` if invalid.

---

## Test Cases (from `tests/test_main.py`)

- **test_register**: Register a new user (valid data)
- **test_login_and_cookie**: Login and check cookies set (requires email verification)
- **test_profile_requires_auth**: Profile endpoint requires authentication
- **test_change_password**: Change password flow
- **test_request_otp**: Request OTP for phone
- **test_verify_otp**: Verify OTP for phone (with correct purpose)
- **test_reset_password**: Reset password with OTP (with correct purpose)
- **test_user_roles**: Get user roles
- **test_assign_role**: Assign a role to a user
- **test_audit_logs**: Get audit logs for a user
- **test_email_verification_flow**: Full email verification (send, verify)
- **test_admin_user_management**: List, search, update, deactivate users (admin)

**All tests pass (green).**

## Registration Uniqueness
- Registration now strictly enforces uniqueness for username, email, and phone number. Attempts to register with a duplicate username, email, or phone will return a 400 error with a clear message.

## Test Coverage Note
- The test suite covers full workflows for all user types (patient, hospital, manufacturer, government, coordinator, admin), including registration, verification, login, profile, password, role assignment, all allowed endpoints, forbidden actions, and edge/negative cases (including duplicate registration, invalid login, expired OTP, unauthorized access, etc.).
- The backend is now bulletproof and ready for immediate frontend integration.

---

## Frontend Integration (with Axios)

### 1. Register
```js
import axios from 'axios';
async function registerUser(data) {
  const res = await axios.post('http://localhost:8001/register/', data);
  return res.data;
}
```

### 2. Login
```js
import axios from 'axios';
async function loginUser(data) {
  const res = await axios.post('http://localhost:8001/login/', data, { withCredentials: true });
  return res.data;
}
```

### 3. Request OTP
```js
import axios from 'axios';
async function requestOtp(phone_number) {
  const res = await axios.post('http://localhost:8001/request-otp/', { phone_number });
  return res.data;
}
```

### 4. Verify OTP
```js
import axios from 'axios';
async function verifyOtp(phone_number, otp_code) {
  const res = await axios.post('http://localhost:8001/verify-otp/', { phone_number, otp_code });
  return res.data;
}
```

### 5. Request Password Reset OTP
```js
import axios from 'axios';
async function requestPasswordResetOtp(phone_number) {
  const res = await axios.post('http://localhost:8001/request-password-reset-otp/', { phone_number });
  return res.data;
}
```

### 6. Reset Password
```js
import axios from 'axios';
async function resetPassword(phone_number, otp_code, new_password) {
  const res = await axios.post('http://localhost:8001/reset-password/', { phone_number, otp_code, new_password });
  return res.data;
}
```

### 7. Get Profile (Authenticated)
```js
import axios from 'axios';
async function getProfile() {
  const res = await axios.get('http://localhost:8001/profile/', { withCredentials: true });
  return res.data;
}
```

### 8. Change Password (Authenticated)
```js
import axios from 'axios';
async function changePassword(old_password, new_password) {
  const res = await axios.post('http://localhost:8001/change-password/', { old_password, new_password }, { withCredentials: true });
  return res.data;
}
```

### 9. Update Profile (Authenticated)
```js
import axios from 'axios';
async function updateProfile(data) {
  const res = await axios.put('http://localhost:8001/profile/update/', data, { withCredentials: true });
  return res.data;
}
```

### 10. Get User Roles (Authenticated)
```js
import axios from 'axios';
async function getUserRoles() {
  const res = await axios.get('http://localhost:8001/user-roles/', { withCredentials: true });
  return res.data;
}
```

### 11. Assign Role (Admin, Authenticated)
```js
import axios from 'axios';
async function assignRole(user_id, role_id) {
  const res = await axios.post('http://localhost:8001/assign-role/', { user_id, role_id }, { withCredentials: true });
  return res.data;
}
```

### 12. Admin User Management (Admin, Authenticated)
```js
import axios from 'axios';
async function listUsers() {
  const res = await axios.get('http://localhost:8001/admin/users/', { withCredentials: true });
  return res.data;
}
async function updateUser(user_id, data) {
  const res = await axios.patch(`http://localhost:8001/admin/users/${user_id}/`, data, { withCredentials: true });
  return res.data;
}
async function deactivateUser(user_id) {
  const res = await axios.delete(`http://localhost:8001/admin/users/${user_id}/deactivate/`, { withCredentials: true });
  return res.data;
}
```

### 13. Email Verification
```js
import axios from 'axios';
async function sendVerificationEmail() {
  const res = await axios.post('http://localhost:8001/email/send-verification/', {}, { withCredentials: true });
  return res.data;
}
async function verifyEmail(email, token) {
  const res = await axios.post('http://localhost:8001/email/verify/', { email, token });
  return res.data;
}
```

---

## Security & Best Practices
- Always use `withCredentials: true` for authenticated requests to send cookies.
- Handle error responses and show user-friendly messages.
- Protect sensitive pages/routes in frontend based on auth state and roles.
- Email verification is required for login.
- CSRF cookies are set as `X-CSRFToken`.

---

## Postman Collection
- A ready-to-import Postman collection is provided as `rakshaayan_auth_service.postman_collection.json`.
- All endpoints are included, with cookie and CSRF handling demonstrated.

---

## Contact
- Backend Lead: Tejus (vmtejus.sisail@gmail.com)
- For issues, open a ticket in the repository. 