# Auth Service - Comprehensive Documentation

## Overview
The Auth Service handles user authentication, registration, password management, OTP, roles, and audit logging for the Rakshaayan platform. It is the central authority for user management and security, supporting all user types (patients, hospitals, manufacturers, government, coordinators, admins).

---

## API Endpoints

| Endpoint           | Method | Description                | Auth Required | Frontend Page(s)         |
|--------------------|--------|----------------------------|--------------|-------------------------|
| /register/         | POST   | Register new user          | No           | /register               |
| /login/            | POST   | Login, set JWT cookies     | No           | /login                  |
| /logout/           | POST   | Logout, clear cookies      | Yes          | (future: user menu)     |
| /profile/          | GET    | Get user profile           | Yes          | (future: profile page)  |
| /profile/update/   | PUT    | Update user profile        | Yes          | (future: profile edit)  |
| /change-password/  | POST   | Change password            | Yes          | (future: settings)      |
| /request-otp/      | POST   | Request OTP for phone      | No           | /register               |
| /verify-otp/       | POST   | Verify OTP                 | No           | /register               |
| /reset-password/   | POST   | Reset password with OTP    | No           | (future: forgot pwd)    |
| /user-roles/       | GET    | Get user roles             | Yes          | (future: admin/settings)|
| /assign-role/      | POST   | Assign role to user        | Yes (admin)  | (future: admin)         |
| /audit-logs/       | GET    | Get audit logs             | Yes          | (future: admin/audit)   |

### Missing/Optional APIs
- Social login (Google, etc.)
- Email verification (OTP is for phone)
- Account deactivation/deletion
- Multi-factor authentication
- Admin endpoints for user search/management (if needed)

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

### 2. Login
- **POST /login/**
- **Input:**
```json
{
  "username": "john",
  "password": "StrongPass123!"
}
```
- **Output:** `200 OK` with user data, sets `access_token` and `refresh_token` cookies.

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

### 5. Reset Password
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

### 6. Change Password
- **POST /change-password/** (auth required)
- **Input:**
```json
{
  "old_password": "StrongPass123!",
  "new_password": "NewPass123!"
}
```
- **Output:** `200 OK` if changed, `400` if invalid.

### 7. Profile
- **GET /profile/** (auth required)
- **Output:** User profile data.

### 8. Update Profile
- **PUT /profile/update/** (auth required)
- **Input:** Partial user fields.
- **Output:** Updated user data.

### 9. User Roles
- **GET /user-roles/** (auth required)
- **Output:** List of roles for the user.

### 10. Assign Role
- **POST /assign-role/** (auth required, admin)
- **Input:**
```json
{
  "user_id": 2,
  "role_id": 1
}
```
- **Output:** Role assignment confirmation.

### 11. Audit Logs
- **GET /audit-logs/** (auth required)
- **Output:** List of audit log entries for the user.

---

## Test Cases (from `tests/test_main.py`)

- **test_register**: Register a new user (valid data)
- **test_login_and_cookie**: Login and check cookies set
- **test_profile_requires_auth**: Profile endpoint requires authentication
- **test_change_password**: Change password flow
- **test_request_otp**: Request OTP for phone
- **test_verify_otp**: Verify OTP for phone
- **test_reset_password**: Reset password with OTP
- **test_user_roles**: Get user roles
- **test_assign_role**: Assign a role to a user
- **test_audit_logs**: Get audit logs for a user

**Recommended additional tests:**
- Register with duplicate username/email/phone
- Login with wrong password
- Expired/invalid OTP
- Unauthorized access to protected endpoints

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

### 5. Reset Password
```js
import axios from 'axios';

async function resetPassword(phone_number, otp_code, new_password) {
  const res = await axios.post('http://localhost:8001/reset-password/', { phone_number, otp_code, new_password });
  return res.data;
}
```

### 6. Get Profile (Authenticated)
```js
import axios from 'axios';

async function getProfile() {
  const res = await axios.get('http://localhost:8001/profile/', { withCredentials: true });
  return res.data;
}
```

### 7. Change Password (Authenticated)
```js
import axios from 'axios';

async function changePassword(old_password, new_password) {
  const res = await axios.post('http://localhost:8001/change-password/', { old_password, new_password }, { withCredentials: true });
  return res.data;
}
```

### 8. Update Profile (Authenticated)
```js
import axios from 'axios';

async function updateProfile(data) {
  const res = await axios.put('http://localhost:8001/profile/update/', data, { withCredentials: true });
  return res.data;
}
```

### 9. Get User Roles (Authenticated)
```js
import axios from 'axios';

async function getUserRoles() {
  const res = await axios.get('http://localhost:8001/user-roles/', { withCredentials: true });
  return res.data;
}
```

### 10. Assign Role (Admin, Authenticated)
```js
import axios from 'axios';

async function assignRole(user_id, role_id) {
  const res = await axios.post('http://localhost:8001/assign-role/', { user_id, role_id }, { withCredentials: true });
  return res.data;
}
```

### 11. Get Audit Logs (Authenticated)
```js
import axios from 'axios';

async function getAuditLogs() {
  const res = await axios.get('http://localhost:8001/audit-logs/', { withCredentials: true });
  return res.data;
}
```

---

## Security & Best Practices
- Always use `withCredentials: true` for authenticated requests to send cookies.
- Handle error responses and show user-friendly messages.
- Protect sensitive pages/routes in frontend based on auth state and roles.

---

## Contact
- Backend Lead: Tejus (vmtejus.sisail@gmail.com)
- For issues, open a ticket in the repository. 