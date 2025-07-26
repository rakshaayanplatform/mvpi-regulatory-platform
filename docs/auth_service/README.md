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

### **NEW ADMIN API ENDPOINTS** (Added for Admin Interface)

| Endpoint           | Method | Description                | Auth Required | Frontend Page(s)         |
|--------------------|--------|----------------------------|--------------|-------------------------|
| /admin/users/create/ | POST | Create new user | Yes (admin) | (admin user mgmt) |
| /admin/users/<id>/activate/ | POST | Activate user | Yes (admin) | (admin user mgmt) |
| /admin/roles/ | GET | List all roles | Yes (admin) | (admin role mgmt) |
| /admin/roles/create/ | POST | Create new role | Yes (admin) | (admin role mgmt) |
| /admin/roles/<id>/ | PUT | Update role | Yes (admin) | (admin role mgmt) |
| /admin/roles/<id>/delete/ | DELETE | Delete role | Yes (admin) | (admin role mgmt) |
| /admin/audit-logs/ | GET | Get all audit logs (admin view) | Yes (admin) | (admin audit logs) |
| /admin/audit-logs/export/ | GET | Export audit logs to CSV | Yes (admin) | (admin audit logs) |
| /admin/system/config/ | GET | Get system configuration | Yes (admin) | (admin system settings) |
| /admin/system/config/update/ | PUT | Update system configuration | Yes (admin) | (admin system settings) |
| /admin/system/health/ | GET | Get system health status | Yes (admin) | (admin system monitoring) |
| /admin/system/backup/ | POST | Initiate manual backup | Yes (admin) | (admin system settings) |
| /admin/system/restart/ | POST | Restart system | Yes (admin) | (admin system settings) |
| /admin/users/<id>/roles/ | GET | Get user's roles | Yes (admin) | (admin role mgmt) |
| /admin/users/<id>/roles/assign/ | POST | Assign role to user | Yes (admin) | (admin role mgmt) |
| /admin/users/<id>/roles/<role_id>/remove/ | DELETE | Remove role from user | Yes (admin) | (admin role mgmt) |

### **FUTURE SERVICE INTEGRATION ENDPOINTS** (Placeholders for Microservices)

| Endpoint           | Method | Description                | Auth Required | Status         |
|--------------------|--------|----------------------------|--------------|----------------|
| /admin/services/patient/overview/ | GET | Patient service overview | Yes (admin) | 🔄 Pending |
| /admin/services/patient/management/ | GET | Patient service management | Yes (admin) | 🔄 Pending |
| /admin/services/government/overview/ | GET | Government service overview | Yes (admin) | 🔄 Pending |
| /admin/services/government/management/ | GET | Government service management | Yes (admin) | 🔄 Pending |
| /admin/services/coordinator/overview/ | GET | Coordinator service overview | Yes (admin) | 🔄 Pending |
| /admin/services/coordinator/management/ | GET | Coordinator service management | Yes (admin) | 🔄 Pending |
| /admin/services/hospital/overview/ | GET | Hospital service overview | Yes (admin) | 🔄 Pending |
| /admin/services/hospital/management/ | GET | Hospital service management | Yes (admin) | 🔄 Pending |
| /admin/services/manufacturer/overview/ | GET | Manufacturer service overview | Yes (admin) | 🔄 Pending |
| /admin/services/manufacturer/management/ | GET | Manufacturer service management | Yes (admin) | 🔄 Pending |
| /admin/services/media/overview/ | GET | Media service overview | Yes (admin) | 🔄 Pending |
| /admin/services/media/management/ | GET | Media service management | Yes (admin) | 🔄 Pending |
| /admin/services/overview/ | GET | All services overview | Yes (admin) | 🔄 Pending |
| /admin/services/communication-logs/ | GET | Inter-service communication logs | Yes (admin) | 🔄 Pending |
| /admin/services/<service>/maintenance/ | POST | Service maintenance mode | Yes (admin) | 🔄 Pending |

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

### **NEW ADMIN API DETAILS**

### 15. Admin Create User
- **POST /admin/users/create/** (admin only)
- **Input:**
```json
{
  "username": "newuser",
  "email": "newuser@email.com",
  "phone_number": "+919876543211",
  "password": "StrongPass123!",
  "user_type": "hospital",
  "organization_name": "City Hospital",
  "designation": "Doctor",
  "address": "123 Medical Street"
}
```
- **Output:** `201 Created` with user data.

### 16. Admin Activate User
- **POST /admin/users/<id>/activate/** (admin only)
- **Output:** `200 OK` with activation confirmation.

### 17. Admin Role Management
- **GET /admin/roles/** (admin only): List all roles
- **POST /admin/roles/create/** (admin only):
```json
{
  "name": "Senior Doctor",
  "description": "Senior medical staff role",
  "permissions": ["view_patients", "edit_reports", "approve_devices"]
}
```
- **PUT /admin/roles/<id>/** (admin only): Update role
- **DELETE /admin/roles/<id>/delete/** (admin only): Delete role

### 18. Admin Audit Logs
- **GET /admin/audit-logs/** (admin only): Get all audit logs with filtering
- **Query Parameters:** `q` (search), `action`, `resource_type`, `start_date`, `end_date`
- **GET /admin/audit-logs/export/** (admin only): Export audit logs to CSV

### 19. Admin System Configuration
- **GET /admin/system/config/** (admin only): Get system configuration
- **PUT /admin/system/config/update/** (admin only):
```json
{
  "site_name": "NIMHANS Medical Device Monitoring",
  "maintenance_mode": false,
  "registration_enabled": true,
  "email_notifications": true,
  "backup_frequency": "daily",
  "session_timeout": 30,
  "max_login_attempts": 5,
  "password_policy": {
    "min_length": 8,
    "require_uppercase": true,
    "require_numbers": true,
    "require_special": true
  }
}
```

### 20. Admin System Health
- **GET /admin/system/health/** (admin only): Get system health metrics
- **Output:** CPU, memory, disk usage, uptime, connections, database/cache status

### 21. Admin System Actions
- **POST /admin/system/backup/** (admin only): Initiate manual backup
- **POST /admin/system/restart/** (admin only): Restart system

### 22. Admin User Role Management
- **GET /admin/users/<id>/roles/** (admin only): Get user's roles
- **POST /admin/users/<id>/roles/assign/** (admin only):
```json
{
  "role_id": 1
}
```
- **DELETE /admin/users/<id>/roles/<role_id>/remove/** (admin only): Remove role from user

### **FUTURE SERVICE INTEGRATION API DETAILS**

### 23. Patient Service Admin (Future Implementation)
- **GET /admin/services/patient/overview/** (admin only): Get patient service overview
  - Total patients registered
  - Active patients
  - Pending registrations
  - Recent activities
- **GET /admin/services/patient/management/** (admin only): Patient service management
  - Patient data management
  - Service configuration
  - Data export/import

### 24. Government Service Admin (Future Implementation)
- **GET /admin/services/government/overview/** (admin only): Get government service overview
  - Government officials registered
  - Regulatory activities
  - Compliance reports
  - Policy management
- **GET /admin/services/government/management/** (admin only): Government service management
  - Regulatory data management
  - Policy configuration
  - Compliance monitoring

### 25. Coordinator Service Admin (Future Implementation)
- **GET /admin/services/coordinator/overview/** (admin only): Get coordinator service overview
  - MDMC coordinators registered
  - Coordination activities
  - Task management
  - Communication logs
- **GET /admin/services/coordinator/management/** (admin only): Coordinator service management
  - Coordinator data management
  - Task configuration
  - Communication settings

### 26. Hospital Service Admin (Future Implementation)
- **GET /admin/services/hospital/overview/** (admin only): Get hospital service overview
  - Hospitals registered
  - Medical staff
  - Device registrations
  - Incident reports
- **GET /admin/services/hospital/management/** (admin only): Hospital service management
  - Hospital data management
  - Staff management
  - Device management
  - Incident management

### 27. Manufacturer Service Admin (Future Implementation)
- **GET /admin/services/manufacturer/overview/** (admin only): Get manufacturer service overview
  - Manufacturers registered
  - Device catalogs
  - Certification status
  - Compliance reports
- **GET /admin/services/manufacturer/management/** (admin only): Manufacturer service management
  - Manufacturer data management
  - Device catalog management
  - Certification management
  - Compliance monitoring

### 28. Media Service Admin (Future Implementation)
- **GET /admin/services/media/overview/** (admin only): Get media service overview
  - Media files stored
  - Storage usage
  - File types
  - Upload/download statistics
- **GET /admin/services/media/management/** (admin only): Media service management
  - Media file management
  - Storage configuration
  - Access control
  - Backup management

### 29. Cross-Service Admin (Future Implementation)
- **GET /admin/services/overview/** (admin only): Get overview of all microservices
  - Service health status
  - Inter-service communication
  - Overall system statistics
  - Service dependencies
- **GET /admin/services/communication-logs/** (admin only): Get inter-service communication logs
  - API calls between services
  - Communication errors
  - Performance metrics
  - Dependency tracking
- **POST /admin/services/<service>/maintenance/** (admin only): Enable/disable maintenance mode for specific service
  - Service-specific maintenance mode
  - Graceful shutdown
  - Health checks

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

### **NEW ADMIN FRONTEND INTEGRATION**

### 14. Admin Create User
```js
import axios from 'axios';
async function adminCreateUser(userData) {
  const res = await axios.post('http://localhost:8001/admin/users/create/', userData, { withCredentials: true });
  return res.data;
}
```

### 15. Admin Activate User
```js
import axios from 'axios';
async function adminActivateUser(userId) {
  const res = await axios.post(`http://localhost:8001/admin/users/${userId}/activate/`, {}, { withCredentials: true });
  return res.data;
}
```

### 16. Admin Role Management
```js
import axios from 'axios';
async function adminListRoles() {
  const res = await axios.get('http://localhost:8001/admin/roles/', { withCredentials: true });
  return res.data;
}
async function adminCreateRole(roleData) {
  const res = await axios.post('http://localhost:8001/admin/roles/create/', roleData, { withCredentials: true });
  return res.data;
}
async function adminUpdateRole(roleId, roleData) {
  const res = await axios.put(`http://localhost:8001/admin/roles/${roleId}/`, roleData, { withCredentials: true });
  return res.data;
}
async function adminDeleteRole(roleId) {
  const res = await axios.delete(`http://localhost:8001/admin/roles/${roleId}/delete/`, { withCredentials: true });
  return res.data;
}
```

### 17. Admin Audit Logs
```js
import axios from 'axios';
async function adminGetAuditLogs(filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await axios.get(`http://localhost:8001/admin/audit-logs/?${params}`, { withCredentials: true });
  return res.data;
}
async function adminExportAuditLogs() {
  const res = await axios.get('http://localhost:8001/admin/audit-logs/export/', { 
    withCredentials: true,
    responseType: 'blob'
  });
  return res.data;
}
```

### 18. Admin System Configuration
```js
import axios from 'axios';
async function adminGetSystemConfig() {
  const res = await axios.get('http://localhost:8001/admin/system/config/', { withCredentials: true });
  return res.data;
}
async function adminUpdateSystemConfig(configData) {
  const res = await axios.put('http://localhost:8001/admin/system/config/update/', configData, { withCredentials: true });
  return res.data;
}
```

### 19. Admin System Health
```js
import axios from 'axios';
async function adminGetSystemHealth() {
  const res = await axios.get('http://localhost:8001/admin/system/health/', { withCredentials: true });
  return res.data;
}
```

### 20. Admin System Actions
```js
import axios from 'axios';
async function adminSystemBackup() {
  const res = await axios.post('http://localhost:8001/admin/system/backup/', {}, { withCredentials: true });
  return res.data;
}
async function adminSystemRestart() {
  const res = await axios.post('http://localhost:8001/admin/system/restart/', {}, { withCredentials: true });
  return res.data;
}
```

### 21. Admin User Role Management
```js
import axios from 'axios';
async function adminGetUserRoles(userId) {
  const res = await axios.get(`http://localhost:8001/admin/users/${userId}/roles/`, { withCredentials: true });
  return res.data;
}
async function adminAssignUserRole(userId, roleId) {
  const res = await axios.post(`http://localhost:8001/admin/users/${userId}/roles/assign/`, { role_id: roleId }, { withCredentials: true });
  return res.data;
}
async function adminRemoveUserRole(userId, roleId) {
  const res = await axios.delete(`http://localhost:8001/admin/users/${userId}/roles/${roleId}/remove/`, { withCredentials: true });
  return res.data;
}
```

### **FUTURE SERVICE INTEGRATION FRONTEND EXAMPLES**

### 22. Patient Service Admin
```js
import axios from 'axios';
async function adminGetPatientServiceOverview() {
  const res = await axios.get('http://localhost:8001/admin/services/patient/overview/', { withCredentials: true });
  return res.data;
}
async function adminGetPatientServiceManagement() {
  const res = await axios.get('http://localhost:8001/admin/services/patient/management/', { withCredentials: true });
  return res.data;
}
```

### 23. Government Service Admin
```js
import axios from 'axios';
async function adminGetGovernmentServiceOverview() {
  const res = await axios.get('http://localhost:8001/admin/services/government/overview/', { withCredentials: true });
  return res.data;
}
async function adminGetGovernmentServiceManagement() {
  const res = await axios.get('http://localhost:8001/admin/services/government/management/', { withCredentials: true });
  return res.data;
}
```

### 24. Coordinator Service Admin
```js
import axios from 'axios';
async function adminGetCoordinatorServiceOverview() {
  const res = await axios.get('http://localhost:8001/admin/services/coordinator/overview/', { withCredentials: true });
  return res.data;
}
async function adminGetCoordinatorServiceManagement() {
  const res = await axios.get('http://localhost:8001/admin/services/coordinator/management/', { withCredentials: true });
  return res.data;
}
```

### 25. Hospital Service Admin
```js
import axios from 'axios';
async function adminGetHospitalServiceOverview() {
  const res = await axios.get('http://localhost:8001/admin/services/hospital/overview/', { withCredentials: true });
  return res.data;
}
async function adminGetHospitalServiceManagement() {
  const res = await axios.get('http://localhost:8001/admin/services/hospital/management/', { withCredentials: true });
  return res.data;
}
```

### 26. Manufacturer Service Admin
```js
import axios from 'axios';
async function adminGetManufacturerServiceOverview() {
  const res = await axios.get('http://localhost:8001/admin/services/manufacturer/overview/', { withCredentials: true });
  return res.data;
}
async function adminGetManufacturerServiceManagement() {
  const res = await axios.get('http://localhost:8001/admin/services/manufacturer/management/', { withCredentials: true });
  return res.data;
}
```

### 27. Media Service Admin
```js
import axios from 'axios';
async function adminGetMediaServiceOverview() {
  const res = await axios.get('http://localhost:8001/admin/services/media/overview/', { withCredentials: true });
  return res.data;
}
async function adminGetMediaServiceManagement() {
  const res = await axios.get('http://localhost:8001/admin/services/media/management/', { withCredentials: true });
  return res.data;
}
```

### 28. Cross-Service Admin
```js
import axios from 'axios';
async function adminGetAllServicesOverview() {
  const res = await axios.get('http://localhost:8001/admin/services/overview/', { withCredentials: true });
  return res.data;
}
async function adminGetServiceCommunicationLogs() {
  const res = await axios.get('http://localhost:8001/admin/services/communication-logs/', { withCredentials: true });
  return res.data;
}
async function adminSetServiceMaintenanceMode(serviceName, enabled) {
  const res = await axios.post(`http://localhost:8001/admin/services/${serviceName}/maintenance/`, { enabled }, { withCredentials: true });
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
- Admin endpoints require admin authentication and authorization.

---

## Postman Collection
- A ready-to-import Postman collection is provided as `rakshaayan_auth_service.postman_collection.json`.
- All endpoints are included, with cookie and CSRF handling demonstrated.
- **NEW:** Updated collection includes all new admin endpoints.

---

## Contact
- Backend Lead: Tejus (vmtejus.sisail@gmail.com)
- For issues, open a ticket in the repository. 