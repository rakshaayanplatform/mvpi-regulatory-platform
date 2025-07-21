# Rakshaayan Platform: Auth & Patient Service Backend API Specification

---

## Table of Contents
1. [Overview](#overview)
2. [Service-Database-Table Mapping](#service-database-table-mapping)
3. [Database Models](#database-models)
   - [Auth Service Models](#auth-service-models)
   - [Patient Service Models](#patient-service-models)
4. [API Endpoints](#api-endpoints)
   - [Auth Service APIs](#auth-service-apis)
   - [Patient Service APIs](#patient-service-apis)
5. [Testing Strategies & Test Cases](#testing-strategies--test-cases)
   - [Auth Service Testing](#auth-service-testing)
   - [Patient Service Testing](#patient-service-testing)
6. [API Call Examples (cURL & Postman)](#api-call-examples-curl--postman)
   - [Auth Service API Calls](#auth-service-api-calls)
   - [Patient Service API Calls](#patient-service-api-calls)
7. [Example test.py for Django/Pytest](#example-testpy-for-djangopytest)
   - [Auth Service test.py](#auth-service-testpy)
   - [Patient Service test.py](#patient-service-testpy)
8. [Integration: Patient Service & Auth Service](#integration-patient-service--auth-service)
9. [Security & Tokens](#security--tokens)
10. [Setup Guidelines: PostgreSQL & Environment](#setup-guidelines-postgresql--environment)
11. [Appendix: Example Payloads](#appendix-example-payloads)

---

## 1. Overview

This document provides a comprehensive backend specification for the **Auth** and **Patient** services of the Rakshaayan platform. It covers:
- Database models
- REST API endpoints (with input/output, security, and frontend mapping)
- Integration between services
- Security and token handling
- Testing and best practices
- Example API calls (cURL & Postman)
- Example test.py for Django/Pytest

**Database Isolation:**
- Each microservice will use its own dedicated PostgreSQL database for maximum isolation, scalability, and maintainability.
- **Recommended Database Names:**
  - Auth Service: `rakshaayan_auth`
  - Patient Service: `rakshaayan_patient`

---

## 2. Service-Database-Table Mapping

| Service           | Database Name       | Tables (Models)                        |
|-------------------|--------------------|----------------------------------------|
| Auth Service      | rakshaayan_auth    | auth_users, auth_roles, auth_user_roles, auth_otps, auth_audit_logs |
| Patient Service   | rakshaayan_patient | patient_adverse_events, patient_event_attachments |

---

## 3. Database Models

### Auth Service Models

**Database:** `rakshaayan_auth`

- **User** (`auth_users`)
- **Role** (`auth_roles`)
- **UserRole** (`auth_user_roles`)
- **OTP** (`auth_otps`)
- **AuditLog** (`auth_audit_logs`)

### Patient Service Models

**Database:** `rakshaayan_patient`

- **AdverseEvent** (`patient_adverse_events`)
- **EventAttachment** (`patient_event_attachments`)

---

## 4. Detailed Models & Serializers

### Auth Service Models

#### User (`auth_users`)
| Field              | Type         | Max Length | Null | Unique | Indexed | Choices (if any) | Default | Constraints/Validation                  | Notes |
|--------------------|-------------|------------|------|--------|---------|------------------|---------|-----------------------------------------|-------|
| id                 | Integer (PK)|            | No   | Yes    | Yes     |                  |         | Auto-increment                          |       |
| username           | CharField   | 150        | No   | Yes    | Yes     |                  |         | Regex: `^[\w.@+-]+$`                   | Required, unique |
| email              | EmailField  | 254        | No   | Yes    | Yes     |                  |         | Email regex, lowercased                 | Required, unique |
| phone_number       | CharField   | 15         | No   | Yes    | Yes     |                  |         | Regex: `^\+?\d{10,15}$`                | E.164 format |
| user_type          | CharField   | 20         | No   | No     | Yes     | patient, hospital, manufacturer, government, coordinator, admin |         | Must be one of choices                  |       |
| is_phone_verified  | Boolean     |            | No   | No     |         |                  | False   |                                         |       |
| password           | CharField   | 128        | No   | No     |         |                  |         | Min 8 chars, 1 upper, 1 lower, 1 digit, 1 special | Hashed |
| organization_name  | CharField   | 200        | Yes  | No     |         |                  |         |                                         | Optional |
| designation        | CharField   | 100        | Yes  | No     |         |                  |         |                                         | Optional |
| address            | TextField   |            | Yes  | No     |         |                  |         |                                         | Optional |
| created_at         | DateTime    |            | No   | No     |         |                  | now     | Auto-set                                |       |
| updated_at         | DateTime    |            | No   | No     |         |                  | now     | Auto-update                             |       |

**Validation:**
- `username`: required, unique, regex, max 150
- `email`: required, unique, valid email, lowercased
- `phone_number`: required, unique, regex, E.164
- `password`: required, min 8, 1 upper, 1 lower, 1 digit, 1 special, not similar to username/email
- `user_type`: required, must be one of choices

#### Role (`auth_roles`)
| Field         | Type        | Max Length | Null | Unique | Indexed | Default | Constraints/Validation | Notes |
|---------------|-------------|------------|------|--------|---------|---------|-----------------------|-------|
| id            | Integer (PK)|            | No   | Yes    | Yes     |         | Auto-increment        |       |
| name          | CharField   | 100        | No   | Yes    | Yes     |         | Regex: `^[\w ]+$`    | Required, unique |
| description   | TextField   |            | Yes  | No     |         |         |                       | Optional |
| permissions   | JSONField   |            | No   | No     |         | []      | List of permission strings |       |
| created_at    | DateTime    |            | No   | No     |         | now     | Auto-set              |       |

#### UserRole (`auth_user_roles`)
| Field         | Type        | Null | Unique | Indexed | Default | Constraints/Validation | Notes |
|---------------|-------------|------|--------|---------|---------|-----------------------|-------|
| id            | Integer (PK)| No   | Yes    | Yes     |         | Auto-increment        |       |
| user          | FK(User)    | No   | No     | Yes     |         | on_delete=CASCADE     |       |
| role          | FK(Role)    | No   | No     | Yes     |         | on_delete=CASCADE     |       |
| assigned_by   | FK(User)    | Yes  | No     |         |         | on_delete=SET_NULL    |       |
| assigned_at   | DateTime    | No   | No     |         | now     | Auto-set              |       |

**Unique Together:** (user, role)

#### OTP (`auth_otps`)
| Field         | Type        | Max Length | Null | Unique | Indexed | Default | Constraints/Validation | Notes |
|---------------|-------------|------------|------|--------|---------|---------|-----------------------|-------|
| id            | Integer (PK)|            | No   | Yes    | Yes     |         | Auto-increment        |       |
| user          | FK(User)    | No   | No     | Yes     |         | on_delete=CASCADE     |       |
| otp_code      | CharField   | 6          | No   | No     |         |         | Regex: `^\d{6}$`     | 6-digit numeric |
| is_used       | Boolean     |            | No   | No     |         | False   |                       |       |
| created_at    | DateTime    |            | No   | No     |         | now     | Auto-set              |       |
| expires_at    | DateTime    |            | No   | No     |         |         |                       |       |

#### AuditLog (`auth_audit_logs`)
| Field         | Type        | Max Length | Null | Unique | Indexed | Default | Constraints/Validation | Notes |
|---------------|-------------|------------|------|--------|---------|---------|-----------------------|-------|
| id            | Integer (PK)|            | No   | Yes    | Yes     |         | Auto-increment        |       |
| user          | FK(User)    | Yes  | No     | Yes     |         | on_delete=SET_NULL    |       |
| action        | CharField   | 20         | No   | No     |         |         | Choices: login, logout, create, update, delete, view |       |
| resource_type | CharField   | 100        | No   | No     |         |         |                       |       |
| resource_id   | CharField   | 100        | Yes  | No     |         |         |                       |       |
| details       | JSONField   |            | No   | No     |         | {}      |                       |       |
| ip_address    | GenericIP   |            | No   | No     |         |         | IPv4/IPv6             |       |
| user_agent    | TextField   |            | Yes  | No     |         |         |                       |       |
| created_at    | DateTime    |            | No   | No     |         | now     | Auto-set              |       |

---

#### Auth Service Serializers

- **UserSerializer**: All fields except password (write_only), is_phone_verified (read_only)
- **UserRegistrationSerializer**: username, email, phone_number, password (write_only, validated), user_type
- **UserLoginSerializer**: username/email, password (write_only)
- **UserRoleSerializer**: user, role, assigned_by, assigned_at
- **AuditLogSerializer**: all fields, user (read_only)
- **PasswordChangeSerializer**: old_password, new_password (write_only, validated)
- **PasswordResetRequestSerializer**: phone_number (validated)
- **PasswordResetConfirmSerializer**: phone_number, otp_code, new_password (write_only, validated)

**Validation:**
- All serializers enforce model constraints, regex, and required fields.
- Password fields use custom validators for strength.
- Email/phone uniqueness checked in registration.

---

### Patient Service Models

#### AdverseEvent (`patient_adverse_events`)
| Field                | Type         | Max Length | Null | Unique | Indexed | Choices (if any) | Default | Constraints/Validation                  | Notes |
|----------------------|-------------|------------|------|--------|---------|------------------|---------|-----------------------------------------|-------|
| id                   | Integer (PK)|            | No   | Yes    | Yes     |                  |         | Auto-increment                          |       |
| patient              | FK(User)    |            | No   | No     | Yes     |                  |         | on_delete=CASCADE                       | References Auth User |
| title                | CharField   | 200        | No   | No     |         |                  |         | Required, max 200                       |       |
| description          | TextField   |            | No   | No     |         |                  |         | Required                                 |       |
| severity             | CharField   | 20         | No   | No     |         | mild, moderate, severe, critical |         | Must be one of choices                  |       |
| status               | CharField   | 20         | No   | No     |         | draft, submitted, under_review, approved, rejected | draft   | Must be one of choices                  |       |
| device_name          | CharField   | 200        | No   | No     |         |                  |         | Required, max 200                       |       |
| device_category      | CharField   | 100        | No   | No     |         |                  |         | Required, max 100                       |       |
| manufacturer         | CharField   | 200        | No   | No     |         |                  |         | Required, max 200                       |       |
| model_number         | CharField   | 100        | Yes  | No     |         |                  |         | Optional, max 100                       |       |
| serial_number        | CharField   | 100        | Yes  | No     |         |                  |         | Optional, max 100                       |       |
| event_date           | DateField   |            | No   | No     |         |                  |         | Required, must be valid date            |       |
| event_location       | CharField   | 200        | No   | No     |         |                  |         | Required, max 200                       |       |
| symptoms             | TextField   |            | No   | No     |         |                  |         | Required                                 |       |
| treatment_received   | TextField   |            | Yes  | No     |         |                  |         | Optional                                 |       |
| outcome              | TextField   |            | Yes  | No     |         |                  |         | Optional                                 |       |
| witnesses            | TextField   |            | Yes  | No     |         |                  |         | Optional                                 |       |
| additional_notes     | TextField   |            | Yes  | No     |         |                  |         | Optional                                 |       |
| supporting_documents | JSONField   |            | No   | No     |         |                  | []      | List of file info, validated             |       |
| created_at           | DateTime    |            | No   | No     |         |                  | now     | Auto-set                                |       |
| updated_at           | DateTime    |            | No   | No     |         |                  | now     | Auto-update                             |       |
| reviewed_by          | FK(User)    |            | Yes  | No     |         |                  |         | on_delete=SET_NULL                      | References Auth User |
| reviewed_at          | DateTime    |            | Yes  | No     |         |                  |         | Optional                                 |       |

**Validation:**
- All required fields must be present
- Severity/status must be valid choice
- Dates must be valid and not in future
- String fields must not exceed max length

#### EventAttachment (`patient_event_attachments`)
| Field         | Type        | Max Length | Null | Unique | Indexed | Default | Constraints/Validation | Notes |
|---------------|-------------|------------|------|--------|---------|---------|-----------------------|-------|
| id            | Integer (PK)|            | No   | Yes    | Yes     |         | Auto-increment        |       |
| event         | FK(AdverseEvent) |        | No   | No     | Yes     |         | on_delete=CASCADE     |       |
| file_name     | CharField   | 255        | No   | No     |         |         | Required, max 255     |       |
| file_type     | CharField   | 20         | No   | No     |         | image, document, video, audio |         | Must be one of choices                  |       |
| file_size     | Integer     |            | No   | No     |         |         | Max 10MB (10485760)   |       |
| file_path     | CharField   | 500        | No   | No     |         |         | Required, max 500     |       |
| uploaded_at   | DateTime    |            | No   | No     |         | now     | Auto-set              |       |

**Validation:**
- File type must be allowed
- File size must not exceed max
- File name/path required

---

#### Patient Service Serializers

- **AdverseEventSerializer**: All fields, patient/reviewed_by (read_only), status (validated), supporting_documents (validated list)
- **EventAttachmentSerializer**: event (read_only), file_name, file_type, file_size, file_path, uploaded_at (read_only)

**Validation:**
- All serializers enforce model constraints, choices, and required fields
- File upload serializer validates file type/size
- Dates validated for format and logic

---

## 4. API Endpoints

### Auth Service APIs

| Endpoint | Method | Description | Frontend Page | Input | Output | Auth |
|----------|--------|-------------|--------------|-------|--------|------|
| `/api/v1/auth/register/` | POST | Register new user | Register | JSON: username, email, phone, password, user_type | user, message | No |
| `/api/v1/auth/login/` | POST | Login user | Login | JSON: username/email, password | tokens, user | No |
| `/api/v1/auth/logout/` | POST | Logout user | Logout | JWT | message | Yes |
| `/api/v1/auth/profile/` | GET | Get user profile | Profile, Dashboard | JWT | user | Yes |
| `/api/v1/auth/profile/` | PUT | Update user profile | Profile | JWT, JSON: fields to update | user, message | Yes |
| `/api/v1/auth/change-password/` | POST | Change password | Settings | JWT, old_password, new_password | message | Yes |
| `/api/v1/auth/request-otp/` | POST | Request OTP (phone) | Register, Forgot Password | phone_number | message | No |
| `/api/v1/auth/verify-otp/` | POST | Verify OTP | Register, Forgot Password | phone_number, otp_code | message | No |
| `/api/v1/auth/reset-password/` | POST | Reset password with OTP | Forgot Password | phone_number, otp_code, new_password | message | No |
| `/api/v1/auth/user-roles/` | GET | Get user roles | Profile, Dashboard | JWT | roles | Yes |
| `/api/v1/auth/assign-role/` | POST | Assign role to user | Admin | JWT, user_id, role_id | role | Yes |
| `/api/v1/auth/audit-logs/` | GET | Get audit logs | Admin | JWT | logs | Yes |

### Patient Service APIs

| Endpoint | Method | Description | Frontend Page | Input | Output | Auth |
|----------|--------|-------------|--------------|-------|--------|------|
| `/api/v1/patient/events/` | GET | List my adverse events | My Reports, Dashboard | JWT | list of events | Yes |
| `/api/v1/patient/events/` | POST | Create new adverse event | Report Adverse Event | JWT, event data | event | Yes |
| `/api/v1/patient/events/<id>/` | GET | Get event details | Report Status, My Reports | JWT | event | Yes |
| `/api/v1/patient/events/<id>/` | PUT | Update event (if draft/pending) | My Reports | JWT, event data | event | Yes |
| `/api/v1/patient/events/<id>/` | DELETE | Delete event (if draft) | My Reports | JWT | message | Yes |
| `/api/v1/patient/events/<id>/submit/` | POST | Submit draft event | My Reports | JWT | event, message | Yes |
| `/api/v1/patient/events/<id>/attachments/` | POST | Upload attachment | Report Adverse Event | JWT, file | attachment | Yes |
| `/api/v1/patient/profile/` | GET | Get patient profile | Patient Profile | JWT | user | Yes |
| `/api/v1/patient/profile/` | PUT | Update patient profile | Patient Profile | JWT, fields | user | Yes |
| `/api/v1/patient/settings/` | GET | Get patient settings | Settings | JWT | settings | Yes |
| `/api/v1/patient/settings/` | PUT | Update patient settings | Settings | JWT, fields | settings | Yes |
| `/api/v1/patient/help/` | GET | Get help/FAQ | Help Center | - | help data | No/Yes |

---

## 5. Testing Strategies & Test Cases

### Auth Service Testing

#### **Unit & Integration Test Cases**
| Test Case | Description | Input | Expected Output |
|-----------|-------------|-------|----------------|
| Register User | Valid registration | Valid JSON | 201, user object |
| Register User (Duplicate Email) | Email already exists | JSON with existing email | 400, error |
| Login (Valid) | Correct credentials | JSON | 200, tokens |
| Login (Invalid) | Wrong password | JSON | 400, error |
| Profile (Auth) | Valid JWT | JWT in header | 200, user data |
| Profile (No Auth) | No JWT | - | 401, error |
| Change Password | Valid old/new | JSON, JWT | 200, message |
| Change Password (Wrong Old) | Wrong old password | JSON, JWT | 400, error |
| Request OTP | Valid phone | JSON | 200, message |
| Verify OTP | Valid OTP | JSON | 200, message |
| Reset Password | Valid OTP/new | JSON | 200, message |
| Assign Role | Valid user/role | JSON, JWT | 201, role |
| Audit Logs | Valid JWT | JWT | 200, logs |

#### **Edge & Security Test Cases**
- Register with missing fields (400)
- Login with SQL injection attempt (400)
- Access profile with expired JWT (401)
- Change password with weak new password (400)
- Assign role as non-admin (403)

### Patient Service Testing

#### **Unit & Integration Test Cases**
| Test Case | Description | Input | Expected Output |
|-----------|-------------|-------|----------------|
| List Events | Authenticated user | JWT | 200, list of events |
| Create Event | Valid event data | JSON, JWT | 201, event |
| Create Event (Missing Field) | Missing required | JSON, JWT | 400, error |
| Get Event | Valid event ID | JWT | 200, event |
| Get Event (Not Owner) | Event not owned | JWT | 403, error |
| Update Event | Valid update | JSON, JWT | 200, event |
| Delete Event | Valid delete | JWT | 204, message |
| Upload Attachment | Valid file | multipart, JWT | 201, attachment |
| Upload Attachment (Too Large) | File > max size | multipart, JWT | 400, error |

#### **Edge & Security Test Cases**
- Create event with invalid date (400)
- Upload unsupported file type (400)
- Access event with invalid JWT (401)
- Delete event not owned by user (403)

---

## 6. API Call Examples (cURL & Postman)

### Auth Service API Calls

#### Register (cURL)
```bash
curl -X POST http://localhost:8001/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@email.com",
    "phone_number": "9876543210",
    "password": "StrongPass123!",
    "user_type": "patient"
  }'
```

#### Register (Postman)
```json
{
  "info": {
    "name": "Auth Register",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"john\",\n  \"email\": \"john@email.com\",\n  \"phone_number\": \"9876543210\",\n  \"password\": \"StrongPass123!\",\n  \"user_type\": \"patient\"\n}"
        },
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/register/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "register", ""]
        }
      }
    }
  ]
}
```

#### Login (cURL)
```bash
curl -X POST http://localhost:8001/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{ "username": "john", "password": "StrongPass123!" }'
```

#### Login (Postman)
```json
{
  "info": {
    "name": "Auth Login",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"john\",\n  \"password\": \"StrongPass123!\"\n}"
        },
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/login/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "login", ""]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Set-Cookie header present\", function () {",
              "    pm.response.to.have.header(\"Set-Cookie\");",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ]
    }
  ]
}
```

#### Profile (cURL)
```bash
curl -X GET http://localhost:8001/api/v1/auth/profile/ \
  -H "Authorization: Bearer <access_token>"
```

#### Profile (Postman)
```json
{
  "info": {
    "name": "Auth Profile",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Profile",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/profile/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "profile", ""]
        }
      }
    }
  ]
}
```

### Patient Service API Calls

#### Create Adverse Event (cURL)
```bash
curl -X POST http://localhost:8002/api/v1/patient/events/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Device malfunction",
    "description": "Stopped working.",
    "severity": "moderate",
    "device_name": "Cardiac Monitor",
    "device_category": "Monitoring",
    "manufacturer": "MedTech Inc.",
    "model_number": "CM-2024",
    "serial_number": "SN123456789",
    "event_date": "2024-06-01",
    "event_location": "Mumbai Hospital",
    "symptoms": "Incorrect readings",
    "treatment_received": "Device replaced",
    "outcome": "No injury",
    "witnesses": "Nurse present",
    "additional_notes": "First occurrence",
    "supporting_documents": []
  }'
```

#### Create Adverse Event (Postman)
```json
{
  "info": {
    "name": "Create Adverse Event",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Event",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Device malfunction\",\n  \"description\": \"Stopped working.\",\n  \"severity\": \"moderate\",\n  \"device_name\": \"Cardiac Monitor\",\n  \"device_category\": \"Monitoring\",\n  \"manufacturer\": \"MedTech Inc.\",\n  \"model_number\": \"CM-2024\",\n  \"serial_number\": \"SN123456789\",\n  \"event_date\": \"2024-06-01\",\n  \"event_location\": \"Mumbai Hospital\",\n  \"symptoms\": \"Incorrect readings\",\n  \"treatment_received\": \"Device replaced\",\n  \"outcome\": \"No injury\",\n  \"witnesses\": \"Nurse present\",\n  \"additional_notes\": \"First occurrence\",\n  \"supporting_documents\": []\n}"
        },
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/events/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "events", ""]
        }
      }
    }
  ]
}
```

#### Upload Attachment (cURL)
```bash
curl -X POST http://localhost:8002/api/v1/patient/events/1/attachments/ \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@/path/to/report.pdf"
```

#### Upload Attachment (Postman)
```json
{
  "info": {
    "name": "Upload Attachment",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Upload Attachment",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            { "key": "file", "type": "file", "src": "/path/to/report.pdf" }
          ]
        },
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/events/1/attachments/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "events", "1", "attachments", ""]
        }
      }
    }
  ]
}
```

---

## 7. Example test.py for Django/Pytest

### Auth Service test.py
```python
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class AuthTests(APITestCase):
    def test_register(self):
        url = reverse('auth-register')
        data = {
            "username": "john",
            "email": "john@email.com",
            "phone_number": "9876543210",
            "password": "StrongPass123!",
            "user_type": "patient"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login(self):
        # Register first
        self.test_register()
        url = reverse('auth-login')
        data = {"username": "john", "password": "StrongPass123!"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Add more tests for profile, change password, etc.
```

### Patient Service test.py
```python
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class PatientEventTests(APITestCase):
    def setUp(self):
        # Register and login user, store token
        pass

    def test_create_event(self):
        url = reverse('patient-events-list')
        data = {
            "title": "Device malfunction",
            "description": "Stopped working.",
            "severity": "moderate",
            "device_name": "Cardiac Monitor",
            "device_category": "Monitoring",
            "manufacturer": "MedTech Inc.",
            "model_number": "CM-2024",
            "serial_number": "SN123456789",
            "event_date": "2024-06-01",
            "event_location": "Mumbai Hospital",
            "symptoms": "Incorrect readings",
            "treatment_received": "Device replaced",
            "outcome": "No injury",
            "witnesses": "Nurse present",
            "additional_notes": "First occurrence",
            "supporting_documents": []
        }
        # Add JWT to header
        response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION='Bearer <token>')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Add more tests for list, update, delete, upload, etc.
```

---

## 8. Integration: Patient Service & Auth Service

- **User Model:** Patient service uses the User model from Auth (via API or shared identifier).
- **JWT Auth:** All patient APIs require JWT tokens issued by Auth service.
- **User Info:** Patient service fetches user info from Auth (direct DB or via `/api/v1/auth/profile/`).
- **Role Checks:** Patient endpoints check `user_type == 'patient'` for access control.
- **Service URLs:** Patient service uses `AUTH_SERVICE_URL` for cross-service calls (see `.env`).

---

## 9. Security & Tokens
- **JWT Authentication:** All sensitive endpoints require JWT in `Authorization: Bearer <token>` header.
- **Refresh Tokens:** Use `/api/v1/auth/login/` to get new tokens.
- **Password Hashing:** Never store plain passwords.
- **Input Validation:** Validate all fields (backend and frontend).
- **Rate Limiting:** Recommended for public endpoints (register, login, OTP).
- **CORS:** Only allow trusted origins (see settings).

---

## 10. Setup Guidelines: PostgreSQL & Environment

### PostgreSQL Setup
1. **Install PostgreSQL**
   - Ubuntu: `sudo apt install postgresql postgresql-contrib`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. **Create Databases and Users**
   ```sql
   CREATE DATABASE rakshaayan_auth;
   CREATE DATABASE rakshaayan_patient;
   CREATE USER auth_user WITH PASSWORD 'your-strong-auth-password';
   CREATE USER patient_user WITH PASSWORD 'your-strong-patient-password';
   GRANT ALL PRIVILEGES ON DATABASE rakshaayan_auth TO auth_user;
   GRANT ALL PRIVILEGES ON DATABASE rakshaayan_patient TO patient_user;
   ```
3. **Update `.env` Files**
   - Set `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` in each service’s `.env`.
4. **Run Migrations**
   - For each service: `python manage.py migrate`
5. **Security**
   - Use strong, unique passwords.
   - Restrict DB access to localhost or internal network.
   - Set up regular backups (e.g., `pg_dump` + cron).

---

## 11. Appendix: Example Payloads

### Register (POST /api/v1/auth/register/)
```json
{
  "username": "john",
  "email": "john@email.com",
  "phone_number": "9876543210",
  "password": "StrongPass123!",
  "user_type": "patient"
}
```

### Create Adverse Event (POST /api/v1/patient/events/)
```json
{
  "title": "Device malfunction",
  "description": "Device stopped working during use.",
  "severity": "moderate",
  "device_name": "Cardiac Monitor",
  "device_category": "Monitoring",
  "manufacturer": "MedTech Inc.",
  "model_number": "CM-2024",
  "serial_number": "SN123456789",
  "event_date": "2024-06-01",
  "event_location": "Mumbai Hospital",
  "symptoms": "Incorrect readings",
  "treatment_received": "Device replaced",
  "outcome": "No injury",
  "witnesses": "Nurse present",
  "additional_notes": "First occurrence",
  "supporting_documents": []
}
```

### Upload Attachment (POST /api/v1/patient/events/<id>/attachments/)
- **Form Data:** `file` (PDF, JPG, PNG, etc.)

---

## 12. Postman Collections for All APIs

### Auth Service Postman Collection (importable JSON)
```json
{
  "info": {
    "name": "Rakshaayan Auth Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"john\",\n  \"email\": \"john@email.com\",\n  \"phone_number\": \"9876543210\",\n  \"password\": \"StrongPass123!\",\n  \"user_type\": \"patient\"\n}"
        },
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/register/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "register", ""]
        }
      }
    },
    {
      "name": "Login (Set-Cookie)",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"john\",\n  \"password\": \"StrongPass123!\"\n}"
        },
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/login/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "login", ""]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Set-Cookie header present\", function () {",
              "    pm.response.to.have.header(\"Set-Cookie\");",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ]
    },
    {
      "name": "Profile (Cookie Auth)",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/profile/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "profile", ""]
        }
      }
    },
    {
      "name": "Logout",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/logout/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "logout", ""]
        }
      }
    },
    {
      "name": "Change Password",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"old_password\": \"StrongPass123!\",\n  \"new_password\": \"StrongerPass123!\"\n}"
        },
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/change-password/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "change-password", ""]
        }
      }
    },
    {
      "name": "Request OTP (Phone)",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phone_number\": \"9876543210\"\n}"
        },
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/request-otp/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "request-otp", ""]
        }
      }
    },
    {
      "name": "Verify OTP",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phone_number\": \"9876543210\",\n  \"otp_code\": \"123456\"\n}"
        },
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/verify-otp/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "verify-otp", ""]
        }
      }
    },
    {
      "name": "Reset Password with OTP",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phone_number\": \"9876543210\",\n  \"otp_code\": \"123456\",\n  \"new_password\": \"StrongerPass123!\"\n}"
        },
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/reset-password/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "reset-password", ""]
        }
      }
    },
    {
      "name": "Get User Roles",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/user-roles/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "user-roles", ""]
        }
      }
    },
    {
      "name": "Assign Role to User",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"user_id\": \"<user_id>\",\n  \"role_id\": \"<role_id>\"\n}"
        },
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/assign-role/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "assign-role", ""]
        }
      }
    },
    {
      "name": "Get Audit Logs",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "url": {
          "raw": "http://localhost:8001/api/v1/auth/audit-logs/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8001",
          "path": ["api", "v1", "auth", "audit-logs", ""]
        }
      }
    }
  ]
}
```

### Patient Service Postman Collection (importable JSON)
```json
{
  "info": {
    "name": "Rakshaayan Patient Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Adverse Event",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" },
          { "key": "Cookie", "value": "access_token=<token_from_auth_service>" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Device malfunction\",\n  \"description\": \"Stopped working.\",\n  \"severity\": \"moderate\",\n  \"device_name\": \"Cardiac Monitor\",\n  \"device_category\": \"Monitoring\",\n  \"manufacturer\": \"MedTech Inc.\",\n  \"model_number\": \"CM-2024\",\n  \"serial_number\": \"SN123456789\",\n  \"event_date\": \"2024-06-01\",\n  \"event_location\": \"Mumbai Hospital\",\n  \"symptoms\": \"Incorrect readings\",\n  \"treatment_received\": \"Device replaced\",\n  \"outcome\": \"No injury\",\n  \"witnesses\": \"Nurse present\",\n  \"additional_notes\": \"First occurrence\",\n  \"supporting_documents\": []\n}"
        },
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/events/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "events", ""]
        }
      }
    },
    {
      "name": "List Adverse Events",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/events/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "events", ""]
        }
      }
    },
    {
      "name": "Get Adverse Event Details",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/events/<id>/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "events", "<id>", ""]
        }
      }
    },
    {
      "name": "Update Adverse Event (Draft)",
      "request": {
        "method": "PUT",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Updated Title\",\n  \"description\": \"Updated description.\",\n  \"severity\": \"high\",\n  \"device_name\": \"Updated Monitor\",\n  \"event_date\": \"2024-06-02\"\n}"
        },
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/events/<id>/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "events", "<id>", ""]
        }
      }
    },
    {
      "name": "Delete Adverse Event (Draft)",
      "request": {
        "method": "DELETE",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/events/<id>/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "events", "<id>", ""]
        }
      }
    },
    {
      "name": "Submit Adverse Event (Draft)",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/events/<id>/submit/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "events", "<id>", "submit", ""]
        }
      }
    },
    {
      "name": "Upload Attachment",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" },
          { "key": "Content-Type", "value": "multipart/form-data" }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            { "key": "file", "type": "file", "src": "/path/to/attachment.pdf" }
          ]
        },
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/events/<id>/attachments/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "events", "<id>", "attachments", ""]
        }
      }
    },
    {
      "name": "Get Patient Profile",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/profile/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "profile", ""]
        }
      }
    },
    {
      "name": "Update Patient Profile",
      "request": {
        "method": "PUT",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"first_name\": \"Updated\",\n  \"last_name\": \"Patient\"\n}"
        },
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/profile/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "profile", ""]
        }
      }
    },
    {
      "name": "Get Patient Settings",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" }
        ],
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/settings/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "settings", ""]
        }
      }
    },
    {
      "name": "Update Patient Settings",
      "request": {
        "method": "PUT",
        "header": [
          { "key": "Authorization", "value": "Bearer <access_token>" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"notification_preference\": \"email\",\n  \"language\": \"en\"\n}"
        },
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/settings/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "settings", ""]
        }
      }
    },
    {
      "name": "Get Help/FAQ",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8002/api/v1/patient/help/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8002",
          "path": ["api", "v1", "patient", "help", ""]
        }
      }
    }
  ]
}
```

---

## Security Note: Cookie-Based Auth for JWT
- For maximum security, use **HTTP-only, Secure cookies** for storing JWT tokens (set via `Set-Cookie` header on login).
- This prevents XSS attacks from accessing tokens in JS.
- Always use `SameSite=Strict` or `Lax` and `Secure` flags in production.
- For even more security, consider **rotating refresh tokens** and **short-lived access tokens**.
- Avoid storing tokens in localStorage/sessionStorage.

---

## Environment Files
- Each service (`auth_service`, `patient_service`) must have its own `env.example` in its own directory.
- Do **not** place Auth Service env files in the Patient Service directory or vice versa. 