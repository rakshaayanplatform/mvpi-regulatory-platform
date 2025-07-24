# Rakshaayan Platform: API Specification for All Microservices (Except Auth & AI)

---

## Table of Contents
1. [Introduction](#introduction)
2. [Coordinator Service](#coordinator-service)
3. [Government Service](#government-service)
4. [Hospital Service](#hospital-service)
5. [Manufacturer Service](#manufacturer-service)
6. [Media Service](#media-service)
7. [Patient Service](#patient-service)

---

## 1. Introduction

This document provides a comprehensive API specification for all backend microservices in the Rakshaayan platform, **excluding Auth and AI services** (which are documented separately). It is based on the frontend requirements and user flows described in `Pages_README.md`.

For each microservice, you will find:
- A summary of its purpose and main responsibilities
- All required API endpoints, grouped by microservice
- For each API:
  - Path, method, summary, frontend page mapping, and purpose
  - Input parameters (headers, path, query, body), required/optional, validation
  - Output/response structure (fields, status codes, error cases)
  - Example cURL command
  - Example Postman request (JSON snippet)
  - Extra notes, edge cases, and developer tips

This is intended as a single source of truth for backend and frontend teams.

---

## 2. Coordinator Service

### **Summary**
The Coordinator Service manages system-wide coordination, user management, report coordination, analytics, and help center for system coordinators.

**Main Features:**
- Coordinator dashboard
- System/user management
- Report coordination
- System analytics
- Settings and help center

---

### **API Endpoints**

#### 2.1 Coordinator Dashboard

**Endpoint:** `/api/v1/coordinator/dashboard/` (GET)

- **Purpose:** Fetches stats, widgets, and quick info for the coordinator dashboard.
- **Frontend Page:** Coordinator Dashboard

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| stats        | object | Dashboard stats (counts, etc)|
| widgets      | array  | List of dashboard widgets    |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8006/api/v1/coordinator/dashboard/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8006/api/v1/coordinator/dashboard/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns all data needed to render the dashboard in one call.
- If the token is expired or missing, returns 401.

---

#### 2.2 System Management

**Endpoint:** `/api/v1/coordinator/system/` (GET, PUT)

- **Purpose:** Get or update system-wide configuration/settings.
- **Frontend Page:** System Management

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| config       | object | System configuration         |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8006/api/v1/coordinator/system/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8006/api/v1/coordinator/system/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| config        | Body   | Yes      | New config object          |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| config       | object | Updated configuration        |

- **Status Codes:** 200 OK, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8006/api/v1/coordinator/system/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"config": {"maintenance_mode": false, ...}}'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8006/api/v1/coordinator/system/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\"config\": {\"maintenance_mode\": false}}"
  }
}
```

**Notes:**
- Only coordinators with system admin rights can update settings.
- Returns 400 if config is invalid.

---

#### 2.3 User Management

**Endpoint:** `/api/v1/coordinator/users/` (GET, POST)

- **Purpose:** List all users or create a new user.
- **Frontend Page:** User Management

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| role          | Query  | No       | Filter by role             |
| status        | Query  | No       | Filter by status           |
| search        | Query  | No       | Search by username/email   |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| users        | array  | List of user objects         |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8006/api/v1/coordinator/users/?role=patient" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8006/api/v1/coordinator/users/?role=patient",
    "host": ["localhost"],
    "port": "8006",
    "path": ["api", "v1", "coordinator", "users", ""],
    "query": [
      {"key": "role", "value": "patient"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| user          | Body   | Yes      | User object (see below)    |

**User Body Example:**
```json
{
  "username": "newuser",
  "email": "newuser@email.com",
  "phone_number": "+919999999999",
  "user_type": "patient",
  "password": "StrongPass123!"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| user         | object | Created user object          |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8006/api/v1/coordinator/users/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@email.com",
    "phone_number": "+919999999999",
    "user_type": "patient",
    "password": "StrongPass123!"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8006/api/v1/coordinator/users/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"username\": \"newuser\",\n  \"email\": \"newuser@email.com\",\n  \"phone_number\": \"+919999999999\",\n  \"user_type\": \"patient\",\n  \"password\": \"StrongPass123!\"\n}"
  }
}
```

**Notes:**
- User creation requires all fields to be valid and unique.
- Returns 400 if any field is invalid or already exists.

---

#### 2.4 Report Coordination

**Endpoint:** `/api/v1/coordinator/reports/` (GET)

- **Purpose:** List all reports for coordination.
- **Frontend Page:** Report Coordination

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| status        | Query  | No       | Filter by report status    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| reports      | array  | List of report objects       |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8006/api/v1/coordinator/reports/?status=pending" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8006/api/v1/coordinator/reports/?status=pending",
    "host": ["localhost"],
    "port": "8006",
    "path": ["api", "v1", "coordinator", "reports", ""],
    "query": [
      {"key": "status", "value": "pending"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns all reports, optionally filtered by status (pending, under_review, completed, etc).

---

## 3. Government Service

### **Summary**
The Government Service (Regulatory) manages regulatory dashboards, report review, compliance monitoring, analytics, policy management, and help center for government officials.

**Main Features:**
- Regulatory dashboard
- Report review and compliance
- Analytics and policy management
- Settings and help center

---

### **API Endpoints**

#### 3.1 Regulatory Dashboard

**Endpoint:** `/api/v1/gov/dashboard/` (GET)

- **Purpose:** Fetches stats and widgets for the regulatory dashboard.
- **Frontend Page:** Regulatory Dashboard

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| stats        | object | Dashboard stats (counts, etc)|
| widgets      | array  | List of dashboard widgets    |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8005/api/v1/gov/dashboard/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8005/api/v1/gov/dashboard/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns all data needed to render the dashboard in one call.
- If the token is expired or missing, returns 401.

---

#### 3.2 Report Review & Compliance

**Endpoint:** `/api/v1/gov/reports/` (GET)

- **Purpose:** List all reports for review.
- **Frontend Page:** Report Review

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| status        | Query  | No       | Filter by report status    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| reports      | array  | List of report objects       |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8005/api/v1/gov/reports/?status=under_review" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8005/api/v1/gov/reports/?status=under_review",
    "host": ["localhost"],
    "port": "8005",
    "path": ["api", "v1", "gov", "reports", ""],
    "query": [
      {"key": "status", "value": "under_review"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns all reports, optionally filtered by status (pending, under_review, completed, etc).

**Endpoint:** `/api/v1/gov/reports/<id>/` (GET)

- **Purpose:** Get details of a specific report.
- **Frontend Page:** Report Review

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Report ID                  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| report       | object | Report details               |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8005/api/v1/gov/reports/123/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8005/api/v1/gov/reports/123/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the report does not exist or is not accessible.

**Endpoint:** `/api/v1/gov/reports/<id>/status/` (PUT)

- **Purpose:** Update the status or compliance of a report.
- **Frontend Page:** Compliance Monitoring

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Report ID                  |
| status        | Body   | Yes      | New status/compliance info |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| report       | object | Updated report object        |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8005/api/v1/gov/reports/123/status/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved", "compliance": true}'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8005/api/v1/gov/reports/123/status/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\"status\": \"approved\", \"compliance\": true}"
  }
}
```

**Notes:**
- Only authorized government users can update report status.
- Returns 400 if status is invalid.

**Endpoint:** `/api/v1/gov/compliance/` (GET)

- **Purpose:** Get compliance data for all reports.
- **Frontend Page:** Compliance Monitoring

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| compliance   | array  | List of compliance records   |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8005/api/v1/gov/compliance/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8005/api/v1/gov/compliance/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns compliance data for all reports.

---

#### 3.3 Analytics & Policy Management

**Endpoint:** `/api/v1/gov/analytics/` (GET)

- **Purpose:** Get analytics dashboard data.
- **Frontend Page:** Analytics Dashboard

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| analytics    | object | Analytics data               |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8005/api/v1/gov/analytics/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8005/api/v1/gov/analytics/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns all analytics data needed for the dashboard.

**Endpoint:** `/api/v1/gov/policies/` (GET, POST)

- **Purpose:** List all policies or create a new policy.
- **Frontend Page:** Policy Management

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| policies     | array  | List of policy objects       |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8005/api/v1/gov/policies/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8005/api/v1/gov/policies/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| policy        | Body   | Yes      | Policy object (see below)  |

**Policy Body Example:**
```json
{
  "title": "New Policy",
  "description": "Policy details...",
  "effective_date": "2024-07-01"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| policy       | object | Created policy object        |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8005/api/v1/gov/policies/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Policy",
    "description": "Policy details...",
    "effective_date": "2024-07-01"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8005/api/v1/gov/policies/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"title\": \"New Policy\",\n  \"description\": \"Policy details...\",\n  \"effective_date\": \"2024-07-01\"\n}"
  }
}
```

**Notes:**
- Policy creation requires all fields to be valid.
- Returns 400 if any field is invalid.

**Endpoint:** `/api/v1/gov/policies/<id>/` (GET, PUT, DELETE)

- **Purpose:** Get, update, or delete a specific policy.
- **Frontend Page:** Policy Management

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Policy ID                  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| policy       | object | Policy details               |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8005/api/v1/gov/policies/42/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8005/api/v1/gov/policies/42/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Policy ID                  |
| policy        | Body   | Yes      | Updated policy object      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| policy       | object | Updated policy object        |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8005/api/v1/gov/policies/42/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Policy",
    "description": "Updated details...",
    "effective_date": "2024-08-01"
  }'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8005/api/v1/gov/policies/42/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"title\": \"Updated Policy\",\n  \"description\": \"Updated details...\",\n  \"effective_date\": \"2024-08-01\"\n}"
  }
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Policy ID                  |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE http://localhost:8005/api/v1/gov/policies/42/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": "http://localhost:8005/api/v1/gov/policies/42/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the policy does not exist.
- Returns 204 on successful deletion.

---

#### 3.4 Settings & Help Center

**Endpoint:** `/api/v1/gov/settings/` (GET, PUT)

- **Purpose:** Get or update regulatory settings.
- **Frontend Page:** Regulatory Settings

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| settings     | object | Regulatory settings          |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8005/api/v1/gov/settings/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8005/api/v1/gov/settings/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| settings      | Body   | Yes      | Updated settings object    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| settings     | object | Updated regulatory settings  |

- **Status Codes:** 200 OK, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8005/api/v1/gov/settings/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"settings": {"timezone": "IST", ...}}'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8005/api/v1/gov/settings/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\"settings\": {\"timezone\": \"IST\"}}"
  }
}
```

**Notes:**
- Only authorized government users can update settings.
- Returns 400 if settings are invalid.

**Endpoint:** `/api/v1/gov/help/` (GET)

- **Purpose:** Get help center/FAQ.
- **Frontend Page:** Regulatory Help Center

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | No       | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| help         | array  | List of help/FAQ entries     |

- **Status Codes:** 200 OK

**cURL:**
```bash
curl -X GET http://localhost:8005/api/v1/gov/help/
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8005/api/v1/gov/help/"
}
```

**Notes:**
- Help center is public, but may return more info if user is authenticated.

---

## 4. Hospital Service

### **Summary**
The Hospital Service manages patient data, appointment scheduling, medical records, and help center for healthcare providers.

**Main Features:**
- Patient management
- Appointment scheduling
- Medical records
- Help center

---

### **API Endpoints**

#### 4.1 Patient Management

**Endpoint:** `/api/v1/hospital/patients/` (GET, POST)

- **Purpose:** List all patients or create a new patient.
- **Frontend Page:** Patient Management

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| search        | Query  | No       | Search by patient ID/name  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| patients     | array  | List of patient objects       |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8007/api/v1/hospital/patients/?search=123" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8007/api/v1/hospital/patients/?search=123",
    "host": ["localhost"],
    "port": "8007",
    "path": ["api", "v1", "hospital", "patients", ""],
    "query": [
      {"key": "search", "value": "123"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| patient       | Body   | Yes      | Patient object (see below) |

**Patient Body Example:**
```json
{
  "patient_id": "HOSP001",
  "name": "John Doe",
  "dob": "1990-01-01",
  "gender": "Male",
  "phone_number": "+919999999999",
  "address": "123 Main St, City, Country"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| patient      | object | Created patient object       |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8007/api/v1/hospital/patients/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "HOSP001",
    "name": "John Doe",
    "dob": "1990-01-01",
    "gender": "Male",
    "phone_number": "+919999999999",
    "address": "123 Main St, City, Country"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8007/api/v1/hospital/patients/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"patient_id\": \"HOSP001\",\n  \"name\": \"John Doe\",\n  \"dob\": \"1990-01-01\",\n  \"gender\": \"Male\",\n  \"phone_number\": \"+919999999999\",\n  \"address\": \"123 Main St, City, Country\"\n}"
  }
}
```

**Notes:**
- Patient creation requires all fields to be valid and unique.
- Returns 400 if any field is invalid or already exists.

**Endpoint:** `/api/v1/hospital/patients/<id>/` (GET, PUT, DELETE)

- **Purpose:** Get, update, or delete a specific patient.
- **Frontend Page:** Patient Management

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Patient ID                  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| patient      | object | Patient details               |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8007/api/v1/hospital/patients/HOSP001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8007/api/v1/hospital/patients/HOSP001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Patient ID                  |
| patient       | Body   | Yes      | Updated patient object      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| patient      | object | Updated patient object        |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8007/api/v1/hospital/patients/HOSP001/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "dob": "1991-02-02",
    "gender": "Female",
    "phone_number": "+919888888888",
    "address": "456 Oak Ave, Town, Country"
  }'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8007/api/v1/hospital/patients/HOSP001/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"name\": \"John Updated\",\n  \"dob\": \"1991-02-02\",\n  \"gender\": \"Female\",\n  \"phone_number\": \"+919888888888\",\n  \"address\": \"456 Oak Ave, Town, Country\"\n}"
  }
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Patient ID                  |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE http://localhost:8007/api/v1/hospital/patients/HOSP001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": "http://localhost:8007/api/v1/hospital/patients/HOSP001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the patient does not exist.
- Returns 204 on successful deletion.

---

#### 4.2 Appointment Scheduling

**Endpoint:** `/api/v1/hospital/appointments/` (GET, POST)

- **Purpose:** List all appointments or create a new appointment.
- **Frontend Page:** Appointment Scheduling

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| patient_id    | Query  | No       | Filter by patient ID       |
| date          | Query  | No       | Filter by appointment date |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| appointments | array  | List of appointment objects  |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8007/api/v1/hospital/appointments/?patient_id=HOSP001&date=2024-07-20" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8007/api/v1/hospital/appointments/?patient_id=HOSP001&date=2024-07-20",
    "host": ["localhost"],
    "port": "8007",
    "path": ["api", "v1", "hospital", "appointments", ""],
    "query": [
      {"key": "patient_id", "value": "HOSP001"},
      {"key": "date", "value": "2024-07-20"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| appointment   | Body   | Yes      | Appointment object (see below) |

**Appointment Body Example:**
```json
{
  "appointment_id": "APPT001",
  "patient_id": "HOSP001",
  "doctor_id": "DOC001",
  "date": "2024-07-20T10:00:00Z",
  "status": "pending",
  "notes": "Initial appointment"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| appointment  | object | Created appointment object   |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8007/api/v1/hospital/appointments/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_id": "APPT001",
    "patient_id": "HOSP001",
    "doctor_id": "DOC001",
    "date": "2024-07-20T10:00:00Z",
    "status": "pending",
    "notes": "Initial appointment"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8007/api/v1/hospital/appointments/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"appointment_id\": \"APPT001\",\n  \"patient_id\": \"HOSP001\",\n  \"doctor_id\": \"DOC001\",\n  \"date\": \"2024-07-20T10:00:00Z\",\n  \"status\": \"pending\",\n  \"notes\": \"Initial appointment\"\n}"
  }
}
```

**Notes:**
- Appointment creation requires all fields to be valid and unique.
- Returns 400 if any field is invalid or already exists.

**Endpoint:** `/api/v1/hospital/appointments/<id>/` (GET, PUT, DELETE)

- **Purpose:** Get, update, or delete a specific appointment.
- **Frontend Page:** Appointment Scheduling

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Appointment ID              |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| appointment  | object | Appointment details          |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8007/api/v1/hospital/appointments/APPT001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8007/api/v1/hospital/appointments/APPT001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Appointment ID              |
| appointment   | Body   | Yes      | Updated appointment object  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| appointment  | object | Updated appointment object   |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8007/api/v1/hospital/appointments/APPT001/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "notes": "Appointment completed"
  }'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8007/api/v1/hospital/appointments/APPT001/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"status\": \"completed\",\n  \"notes\": \"Appointment completed\"\n}"
  }
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Appointment ID              |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE http://localhost:8007/api/v1/hospital/appointments/APPT001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": "http://localhost:8007/api/v1/hospital/appointments/APPT001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the appointment does not exist.
- Returns 204 on successful deletion.

---

#### 4.3 Medical Records

**Endpoint:** `/api/v1/hospital/records/` (GET, POST)

- **Purpose:** List all medical records or create a new record.
- **Frontend Page:** Medical Records

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| patient_id    | Query  | No       | Filter by patient ID       |
| date          | Query  | No       | Filter by record date      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| records      | array  | List of medical record objects |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8007/api/v1/hospital/records/?patient_id=HOSP001&date=2024-07-19" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8007/api/v1/hospital/records/?patient_id=HOSP001&date=2024-07-19",
    "host": ["localhost"],
    "port": "8007",
    "path": ["api", "v1", "hospital", "records", ""],
    "query": [
      {"key": "patient_id", "value": "HOSP001"},
      {"key": "date", "value": "2024-07-19"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| record        | Body   | Yes      | Medical record object (see below) |

**Record Body Example:**
```json
{
  "record_id": "REC001",
  "patient_id": "HOSP001",
  "date": "2024-07-19T09:00:00Z",
  "type": "consultation",
  "notes": "Patient reported headache",
  "diagnosis": "Headache",
  "prescription": "Panadol 500mg",
  "follow_up_date": "2024-07-20T10:00:00Z"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| record       | object | Created medical record object |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8007/api/v1/hospital/records/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "record_id": "REC001",
    "patient_id": "HOSP001",
    "date": "2024-07-19T09:00:00Z",
    "type": "consultation",
    "notes": "Patient reported headache",
    "diagnosis": "Headache",
    "prescription": "Panadol 500mg",
    "follow_up_date": "2024-07-20T10:00:00Z"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8007/api/v1/hospital/records/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"record_id\": \"REC001\",\n  \"patient_id\": \"HOSP001\",\n  \"date\": \"2024-07-19T09:00:00Z\",\n  \"type\": \"consultation\",\n  \"notes\": \"Patient reported headache\",\n  \"diagnosis\": \"Headache\",\n  \"prescription\": \"Panadol 500mg\",\n  \"follow_up_date\": \"2024-07-20T10:00:00Z\"\n}"
  }
}
```

**Notes:**
- Medical record creation requires all fields to be valid and unique.
- Returns 400 if any field is invalid or already exists.

**Endpoint:** `/api/v1/hospital/records/<id>/` (GET, PUT, DELETE)

- **Purpose:** Get, update, or delete a specific medical record.
- **Frontend Page:** Medical Records

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Record ID                  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| record       | object | Medical record details       |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8007/api/v1/hospital/records/REC001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8007/api/v1/hospital/records/REC001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Record ID                  |
| record        | Body   | Yes      | Updated record object      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| record       | object | Updated medical record object |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8007/api/v1/hospital/records/REC001/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Updated notes",
    "diagnosis": "Updated diagnosis",
    "prescription": "Updated prescription"
  }'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8007/api/v1/hospital/records/REC001/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"notes\": \"Updated notes\",\n  \"diagnosis\": \"Updated diagnosis\",\n  \"prescription\": \"Updated prescription\"\n}"
  }
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Record ID                  |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE http://localhost:8007/api/v1/hospital/records/REC001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": "http://localhost:8007/api/v1/hospital/records/REC001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the record does not exist.
- Returns 204 on successful deletion.

---

#### 4.4 Help Center

**Endpoint:** `/api/v1/hospital/help/` (GET)

- **Purpose:** Get help center/FAQ for healthcare providers.
- **Frontend Page:** Hospital Help Center

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | No       | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| help         | array  | List of help/FAQ entries     |

- **Status Codes:** 200 OK

**cURL:**
```bash
curl -X GET http://localhost:8007/api/v1/hospital/help/
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8007/api/v1/hospital/help/"
}
```

**Notes:**
- Help center is public, but may return more info if user is authenticated.

---

## 5. Manufacturer Service

### **Summary**
The Manufacturer Service manages product inventory, manufacturing orders, and quality control for pharmaceutical manufacturers.

**Main Features:**
- Product inventory
- Manufacturing orders
- Quality control
- Settings and help center

---

### **API Endpoints**

#### 5.1 Product Inventory

**Endpoint:** `/api/v1/manufacturer/inventory/` (GET, POST)

- **Purpose:** List all products or create a new product.
- **Frontend Page:** Product Inventory

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| search        | Query  | No       | Search by product ID/name  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| products     | array  | List of product objects       |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8008/api/v1/manufacturer/inventory/?search=Med123" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8008/api/v1/manufacturer/inventory/?search=Med123",
    "host": ["localhost"],
    "port": "8008",
    "path": ["api", "v1", "manufacturer", "inventory", ""],
    "query": [
      {"key": "search", "value": "Med123"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| product       | Body   | Yes      | Product object (see below) |

**Product Body Example:**
```json
{
  "product_id": "MED123",
  "name": "Medicine A",
  "description": "Description for Medicine A",
  "price": 10.50,
  "quantity": 100,
  "category": "Pills",
  "manufacturer": "Manu123"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| product      | object | Created product object       |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8008/api/v1/manufacturer/inventory/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "MED123",
    "name": "Medicine A",
    "description": "Description for Medicine A",
    "price": 10.50,
    "quantity": 100,
    "category": "Pills",
    "manufacturer": "Manu123"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8008/api/v1/manufacturer/inventory/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"product_id\": \"MED123\",\n  \"name\": \"Medicine A\",\n  \"description\": \"Description for Medicine A\",\n  \"price\": 10.50,\n  \"quantity\": 100,\n  \"category\": \"Pills\",\n  \"manufacturer\": \"Manu123\"\n}"
  }
}
```

**Notes:**
- Product creation requires all fields to be valid and unique.
- Returns 400 if any field is invalid or already exists.

**Endpoint:** `/api/v1/manufacturer/inventory/<id>/` (GET, PUT, DELETE)

- **Purpose:** Get, update, or delete a specific product.
- **Frontend Page:** Product Inventory

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Product ID                  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| product      | object | Product details               |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8008/api/v1/manufacturer/inventory/MED123/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8008/api/v1/manufacturer/inventory/MED123/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Product ID                  |
| product       | Body   | Yes      | Updated product object      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| product      | object | Updated product object        |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8008/api/v1/manufacturer/inventory/MED123/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Medicine Updated",
    "description": "Updated description",
    "price": 12.00,
    "quantity": 80,
    "category": "Capsules"
  }'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8008/api/v1/manufacturer/inventory/MED123/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"name\": \"Medicine Updated\",\n  \"description\": \"Updated description\",\n  \"price\": 12.00,\n  \"quantity\": 80,\n  \"category\": \"Capsules\"\n}"
  }
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Product ID                  |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE http://localhost:8008/api/v1/manufacturer/inventory/MED123/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": "http://localhost:8008/api/v1/manufacturer/inventory/MED123/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the product does not exist.
- Returns 204 on successful deletion.

---

#### 5.2 Manufacturing Orders

**Endpoint:** `/api/v1/manufacturer/orders/` (GET, POST)

- **Purpose:** List all manufacturing orders or create a new order.
- **Frontend Page:** Manufacturing Orders

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| product_id    | Query  | No       | Filter by product ID       |
| status        | Query  | No       | Filter by order status     |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| orders       | array  | List of manufacturing order objects |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8008/api/v1/manufacturer/orders/?product_id=MED123&status=pending" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8008/api/v1/manufacturer/orders/?product_id=MED123&status=pending",
    "host": ["localhost"],
    "port": "8008",
    "path": ["api", "v1", "manufacturer", "orders", ""],
    "query": [
      {"key": "product_id", "value": "MED123"},
      {"key": "status", "value": "pending"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| order         | Body   | Yes      | Manufacturing order object (see below) |

**Order Body Example:**
```json
{
  "order_id": "MANU001",
  "product_id": "MED123",
  "quantity": 1000,
  "status": "pending",
  "expected_completion_date": "2024-08-10T10:00:00Z"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| order        | object | Created manufacturing order object |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8008/api/v1/manufacturer/orders/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "MANU001",
    "product_id": "MED123",
    "quantity": 1000,
    "status": "pending",
    "expected_completion_date": "2024-08-10T10:00:00Z"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8008/api/v1/manufacturer/orders/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"order_id\": \"MANU001\",\n  \"product_id\": \"MED123\",\n  \"quantity\": 1000,\n  \"status\": \"pending\",\n  \"expected_completion_date\": \"2024-08-10T10:00:00Z\"\n}"
  }
}
```

**Notes:**
- Manufacturing order creation requires all fields to be valid and unique.
- Returns 400 if any field is invalid or already exists.

**Endpoint:** `/api/v1/manufacturer/orders/<id>/` (GET, PUT, DELETE)

- **Purpose:** Get, update, or delete a specific manufacturing order.
- **Frontend Page:** Manufacturing Orders

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Order ID                  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| order        | object | Manufacturing order details  |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8008/api/v1/manufacturer/orders/MANU001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8008/api/v1/manufacturer/orders/MANU001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Order ID                  |
| order         | Body   | Yes      | Updated order object      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| order        | object | Updated manufacturing order object |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8008/api/v1/manufacturer/orders/MANU001/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "actual_completion_date": "2024-08-09T10:00:00Z"
  }'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8008/api/v1/manufacturer/orders/MANU001/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"status\": \"completed\",\n  \"actual_completion_date\": \"2024-08-09T10:00:00Z\"\n}"
  }
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Order ID                  |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE http://localhost:8008/api/v1/manufacturer/orders/MANU001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": "http://localhost:8008/api/v1/manufacturer/orders/MANU001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the order does not exist.
- Returns 204 on successful deletion.

---

#### 5.3 Quality Control

**Endpoint:** `/api/v1/manufacturer/quality/` (GET, POST)

- **Purpose:** List all quality control records or create a new record.
- **Frontend Page:** Quality Control

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| product_id    | Query  | No       | Filter by product ID       |
| date          | Query  | No       | Filter by record date      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| records      | array  | List of quality control record objects |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8008/api/v1/manufacturer/quality/?product_id=MED123&date=2024-07-18" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8008/api/v1/manufacturer/quality/?product_id=MED123&date=2024-07-18",
    "host": ["localhost"],
    "port": "8008",
    "path": ["api", "v1", "manufacturer", "quality", ""],
    "query": [
      {"key": "product_id", "value": "MED123"},
      {"key": "date", "value": "2024-07-18"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| record        | Body   | Yes      | Quality control record object (see below) |

**Record Body Example:**
```json
{
  "record_id": "QC001",
  "product_id": "MED123",
  "date": "2024-07-18T10:00:00Z",
  "test_type": "purity",
  "result": "passed",
  "notes": "Purity test passed"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| record       | object | Created quality control record object |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8008/api/v1/manufacturer/quality/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "record_id": "QC001",
    "product_id": "MED123",
    "date": "2024-07-18T10:00:00Z",
    "test_type": "purity",
    "result": "passed",
    "notes": "Purity test passed"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8008/api/v1/manufacturer/quality/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"record_id\": \"QC001\",\n  \"product_id\": \"MED123\",\n  \"date\": \"2024-07-18T10:00:00Z\",\n  \"test_type\": \"purity\",\n  \"result\": \"passed\",\n  \"notes\": \"Purity test passed\"\n}"
  }
}
```

**Notes:**
- Quality control record creation requires all fields to be valid and unique.
- Returns 400 if any field is invalid or already exists.

**Endpoint:** `/api/v1/manufacturer/quality/<id>/` (GET, PUT, DELETE)

- **Purpose:** Get, update, or delete a specific quality control record.
- **Frontend Page:** Quality Control

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Record ID                  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| record       | object | Quality control record details |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8008/api/v1/manufacturer/quality/QC001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8008/api/v1/manufacturer/quality/QC001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Record ID                  |
| record        | Body   | Yes      | Updated record object      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| record       | object | Updated quality control record object |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8008/api/v1/manufacturer/quality/QC001/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "result": "failed",
    "notes": "Purity test failed"
  }'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8008/api/v1/manufacturer/quality/QC001/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"result\": \"failed\",\n  \"notes\": \"Purity test failed\"\n}"
  }
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Record ID                  |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE http://localhost:8008/api/v1/manufacturer/quality/QC001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": "http://localhost:8008/api/v1/manufacturer/quality/QC001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the record does not exist.
- Returns 204 on successful deletion.

---

#### 5.4 Settings & Help Center

**Endpoint:** `/api/v1/manufacturer/settings/` (GET, PUT)

- **Purpose:** Get or update manufacturer settings.
- **Frontend Page:** Manufacturer Settings

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| settings     | object | Manufacturer settings        |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8008/api/v1/manufacturer/settings/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8008/api/v1/manufacturer/settings/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| settings      | Body   | Yes      | Updated settings object    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| settings     | object | Updated manufacturer settings |

- **Status Codes:** 200 OK, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8008/api/v1/manufacturer/settings/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"settings": {"timezone": "IST", ...}}'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8008/api/v1/manufacturer/settings/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\"settings\": {\"timezone\": \"IST\"}}"
  }
}
```

**Notes:**
- Only authorized manufacturer users can update settings.
- Returns 400 if settings are invalid.

**Endpoint:** `/api/v1/manufacturer/help/` (GET)

- **Purpose:** Get help center/FAQ for manufacturers.
- **Frontend Page:** Manufacturer Help Center

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | No       | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| help         | array  | List of help/FAQ entries     |

- **Status Codes:** 200 OK

**cURL:**
```bash
curl -X GET http://localhost:8008/api/v1/manufacturer/help/
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8008/api/v1/manufacturer/help/"
}
```

**Notes:**
- Help center is public, but may return more info if user is authenticated.

---

## 6. Media Service

### **Summary**
The Media Service manages image and document storage for the platform.

**Main Features:**
- Image storage
- Document storage
- File management
- Settings and help center

---

### **API Endpoints**

#### 6.1 Image Storage

**Endpoint:** `/api/v1/media/images/` (POST)

- **Purpose:** Upload an image file.
- **Frontend Page:** Image Upload

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| file          | Form   | Yes      | Image file to upload       |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| url          | string | URL of the uploaded image   |

- **Status Codes:** 200 OK, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8009/api/v1/media/images/ \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/your/image.jpg"
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8009/api/v1/media/images/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}],
  "body": {
    "mode": "form-data",
    "formData": [
      {"key": "file", "value": "@/path/to/your/image.jpg"}
    ]
  }
}
```

**Notes:**
- File size limits and allowed formats should be handled by the frontend.
- Returns 400 if file is invalid or exceeds size limits.

---

#### 6.2 Document Storage

**Endpoint:** `/api/v1/media/documents/` (POST)

- **Purpose:** Upload a document file.
- **Frontend Page:** Document Upload

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| file          | Form   | Yes      | Document file to upload    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| url          | string | URL of the uploaded document |

- **Status Codes:** 200 OK, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8009/api/v1/media/documents/ \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/your/document.pdf"
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8009/api/v1/media/documents/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}],
  "body": {
    "mode": "form-data",
    "formData": [
      {"key": "file", "value": "@/path/to/your/document.pdf"}
    ]
  }
}
```

**Notes:**
- File size limits and allowed formats should be handled by the frontend.
- Returns 400 if file is invalid or exceeds size limits.

---

#### 6.3 File Management

**Endpoint:** `/api/v1/media/files/` (GET, DELETE)

- **Purpose:** List all files or delete a specific file.
- **Frontend Page:** File Management

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| type          | Query  | No       | Filter by file type (image, document) |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| files        | array  | List of file objects         |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8009/api/v1/media/files/?type=image" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8009/api/v1/media/files/?type=image",
    "host": ["localhost"],
    "port": "8009",
    "path": ["api", "v1", "media", "files", ""],
    "query": [
      {"key": "type", "value": "image"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| url           | Query  | Yes      | URL of the file to delete  |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE "http://localhost:8009/api/v1/media/files/?url=http://localhost:8009/uploads/image.jpg" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": {
    "raw": "http://localhost:8009/api/v1/media/files/?url=http://localhost:8009/uploads/image.jpg",
    "host": ["localhost"],
    "port": "8009",
    "path": ["api", "v1", "media", "files", ""],
    "query": [
      {"key": "url", "value": "http://localhost:8009/uploads/image.jpg"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- File URLs are typically stored in the database, not directly accessible.
- Returns 404 if the file does not exist.
- Returns 204 on successful deletion.

---

#### 6.4 Settings & Help Center

**Endpoint:** `/api/v1/media/settings/` (GET, PUT)

- **Purpose:** Get or update media storage settings.
- **Frontend Page:** Media Settings

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| settings     | object | Media storage settings       |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8009/api/v1/media/settings/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8009/api/v1/media/settings/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| settings      | Body   | Yes      | Updated settings object    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| settings     | object | Updated media storage settings |

- **Status Codes:** 200 OK, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8009/api/v1/media/settings/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"settings": {"max_file_size": 1024000, ...}}'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8009/api/v1/media/settings/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\"settings\": {\"max_file_size\": 1024000}}"
  }
}
```

**Notes:**
- Only authorized media service users can update settings.
- Returns 400 if settings are invalid.

**Endpoint:** `/api/v1/media/help/` (GET)

- **Purpose:** Get help center/FAQ for media service.
- **Frontend Page:** Media Help Center

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | No       | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| help         | array  | List of help/FAQ entries     |

- **Status Codes:** 200 OK

**cURL:**
```bash
curl -X GET http://localhost:8009/api/v1/media/help/
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8009/api/v1/media/help/"
}
```

**Notes:**
- Help center is public, but may return more info if user is authenticated.

---

## 7. Patient Service

### **Summary**
The Patient Service manages patient data, appointment scheduling, medical records, and help center for patients.

**Main Features:**
- Patient management
- Appointment scheduling
- Medical records
- Help center

---

### **API Endpoints**

#### 7.1 Patient Management

**Endpoint:** `/api/v1/patient/patients/` (GET, POST)

- **Purpose:** List all patients or create a new patient.
- **Frontend Page:** Patient Management

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| search        | Query  | No       | Search by patient ID/name  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| patients     | array  | List of patient objects       |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8010/api/v1/patient/patients/?search=PAT001" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8010/api/v1/patient/patients/?search=PAT001",
    "host": ["localhost"],
    "port": "8010",
    "path": ["api", "v1", "patient", "patients", ""],
    "query": [
      {"key": "search", "value": "PAT001"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| patient       | Body   | Yes      | Patient object (see below) |

**Patient Body Example:**
```json
{
  "patient_id": "PAT001",
  "name": "Jane Doe",
  "dob": "2000-01-01",
  "gender": "Female",
  "phone_number": "+919999999999",
  "address": "789 Pine Ln, Village, Country"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| patient      | object | Created patient object       |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8010/api/v1/patient/patients/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "PAT001",
    "name": "Jane Doe",
    "dob": "2000-01-01",
    "gender": "Female",
    "phone_number": "+919999999999",
    "address": "789 Pine Ln, Village, Country"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8010/api/v1/patient/patients/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"patient_id\": \"PAT001\",\n  \"name\": \"Jane Doe\",\n  \"dob\": \"2000-01-01\",\n  \"gender\": \"Female\",\n  \"phone_number\": \"+919999999999\",\n  \"address\": \"789 Pine Ln, Village, Country\"\n}"
  }
}
```

**Notes:**
- Patient creation requires all fields to be valid and unique.
- Returns 400 if any field is invalid or already exists.

**Endpoint:** `/api/v1/patient/patients/<id>/` (GET, PUT, DELETE)

- **Purpose:** Get, update, or delete a specific patient.
- **Frontend Page:** Patient Management

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Patient ID                  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| patient      | object | Patient details               |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8010/api/v1/patient/patients/PAT001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8010/api/v1/patient/patients/PAT001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Patient ID                  |
| patient       | Body   | Yes      | Updated patient object      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| patient      | object | Updated patient object        |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8010/api/v1/patient/patients/PAT001/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Updated",
    "dob": "2001-02-02",
    "gender": "Male",
    "phone_number": "+919888888888",
    "address": "101 Cedar St, Town, Country"
  }'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8010/api/v1/patient/patients/PAT001/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"name\": \"Jane Updated\",\n  \"dob\": \"2001-02-02\",\n  \"gender\": \"Male\",\n  \"phone_number\": \"+919888888888\",\n  \"address\": \"101 Cedar St, Town, Country\"\n}"
  }
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Patient ID                  |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE http://localhost:8010/api/v1/patient/patients/PAT001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": "http://localhost:8010/api/v1/patient/patients/PAT001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the patient does not exist.
- Returns 204 on successful deletion.

---

#### 7.2 Appointment Scheduling

**Endpoint:** `/api/v1/patient/appointments/` (GET, POST)

- **Purpose:** List all appointments or create a new appointment.
- **Frontend Page:** Appointment Scheduling

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| patient_id    | Query  | No       | Filter by patient ID       |
| date          | Query  | No       | Filter by appointment date |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| appointments | array  | List of appointment objects  |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8010/api/v1/patient/appointments/?patient_id=PAT001&date=2024-07-20" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8010/api/v1/patient/appointments/?patient_id=PAT001&date=2024-07-20",
    "host": ["localhost"],
    "port": "8010",
    "path": ["api", "v1", "patient", "appointments", ""],
    "query": [
      {"key": "patient_id", "value": "PAT001"},
      {"key": "date", "value": "2024-07-20"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| appointment   | Body   | Yes      | Appointment object (see below) |

**Appointment Body Example:**
```json
{
  "appointment_id": "APPT001",
  "patient_id": "PAT001",
  "doctor_id": "DOC001",
  "date": "2024-07-20T10:00:00Z",
  "status": "pending",
  "notes": "Initial appointment"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| appointment  | object | Created appointment object   |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8010/api/v1/patient/appointments/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_id": "APPT001",
    "patient_id": "PAT001",
    "doctor_id": "DOC001",
    "date": "2024-07-20T10:00:00Z",
    "status": "pending",
    "notes": "Initial appointment"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8010/api/v1/patient/appointments/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"appointment_id\": \"APPT001\",\n  \"patient_id\": \"PAT001\",\n  \"doctor_id\": \"DOC001\",\n  \"date\": \"2024-07-20T10:00:00Z\",\n  \"status\": \"pending\",\n  \"notes\": \"Initial appointment\"\n}"
  }
}
```

**Notes:**
- Appointment creation requires all fields to be valid and unique.
- Returns 400 if any field is invalid or already exists.

**Endpoint:** `/api/v1/patient/appointments/<id>/` (GET, PUT, DELETE)

- **Purpose:** Get, update, or delete a specific appointment.
- **Frontend Page:** Appointment Scheduling

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Appointment ID              |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| appointment  | object | Appointment details          |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8010/api/v1/patient/appointments/APPT001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8010/api/v1/patient/appointments/APPT001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Appointment ID              |
| appointment   | Body   | Yes      | Updated appointment object  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| appointment  | object | Updated appointment object   |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8010/api/v1/patient/appointments/APPT001/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "notes": "Appointment completed"
  }'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8010/api/v1/patient/appointments/APPT001/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"status\": \"completed\",\n  \"notes\": \"Appointment completed\"\n}"
  }
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Appointment ID              |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE http://localhost:8010/api/v1/patient/appointments/APPT001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": "http://localhost:8010/api/v1/patient/appointments/APPT001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the appointment does not exist.
- Returns 204 on successful deletion.

---

#### 7.3 Medical Records

**Endpoint:** `/api/v1/patient/records/` (GET, POST)

- **Purpose:** List all medical records or create a new record.
- **Frontend Page:** Medical Records

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| patient_id    | Query  | No       | Filter by patient ID       |
| date          | Query  | No       | Filter by record date      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| records      | array  | List of medical record objects |

- **Status Codes:** 200 OK, 401 Unauthorized

**cURL:**
```bash
curl -X GET "http://localhost:8010/api/v1/patient/records/?patient_id=PAT001&date=2024-07-19" \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": {
    "raw": "http://localhost:8010/api/v1/patient/records/?patient_id=PAT001&date=2024-07-19",
    "host": ["localhost"],
    "port": "8010",
    "path": ["api", "v1", "patient", "records", ""],
    "query": [
      {"key": "patient_id", "value": "PAT001"},
      {"key": "date", "value": "2024-07-19"}
    ]
  },
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**POST**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| record        | Body   | Yes      | Medical record object (see below) |

**Record Body Example:**
```json
{
  "record_id": "REC001",
  "patient_id": "PAT001",
  "date": "2024-07-19T09:00:00Z",
  "type": "consultation",
  "notes": "Patient reported headache",
  "diagnosis": "Headache",
  "prescription": "Panadol 500mg",
  "follow_up_date": "2024-07-20T10:00:00Z"
}
```

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| record       | object | Created medical record object |

- **Status Codes:** 201 Created, 400 Bad Request, 401 Unauthorized

**cURL:**
```bash
curl -X POST http://localhost:8010/api/v1/patient/records/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "record_id": "REC001",
    "patient_id": "PAT001",
    "date": "2024-07-19T09:00:00Z",
    "type": "consultation",
    "notes": "Patient reported headache",
    "diagnosis": "Headache",
    "prescription": "Panadol 500mg",
    "follow_up_date": "2024-07-20T10:00:00Z"
  }'
```

**Postman:**
```json
{
  "method": "POST",
  "url": "http://localhost:8010/api/v1/patient/records/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"record_id\": \"REC001\",\n  \"patient_id\": \"PAT001\",\n  \"date\": \"2024-07-19T09:00:00Z\",\n  \"type\": \"consultation\",\n  \"notes\": \"Patient reported headache\",\n  \"diagnosis\": \"Headache\",\n  \"prescription\": \"Panadol 500mg\",\n  \"follow_up_date\": \"2024-07-20T10:00:00Z\"\n}"
  }
}
```

**Notes:**
- Medical record creation requires all fields to be valid and unique.
- Returns 400 if any field is invalid or already exists.

**Endpoint:** `/api/v1/patient/records/<id>/` (GET, PUT, DELETE)

- **Purpose:** Get, update, or delete a specific medical record.
- **Frontend Page:** Medical Records

**GET**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Record ID                  |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| record       | object | Medical record details       |

- **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X GET http://localhost:8010/api/v1/patient/records/REC001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8010/api/v1/patient/records/REC001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**PUT**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Record ID                  |
| record        | Body   | Yes      | Updated record object      |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| record       | object | Updated medical record object |

- **Status Codes:** 200 OK, 400 Bad Request, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X PUT http://localhost:8010/api/v1/patient/records/REC001/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Updated notes",
    "diagnosis": "Updated diagnosis",
    "prescription": "Updated prescription"
  }'
```

**Postman:**
```json
{
  "method": "PUT",
  "url": "http://localhost:8010/api/v1/patient/records/REC001/",
  "headers": [
    {"key": "Authorization", "value": "Bearer <token>"},
    {"key": "Content-Type", "value": "application/json"}
  ],
  "body": {
    "mode": "raw",
    "raw": "{\n  \"notes\": \"Updated notes\",\n  \"diagnosis\": \"Updated diagnosis\",\n  \"prescription\": \"Updated prescription\"\n}"
  }
}
```

**DELETE**
| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | Yes      | Bearer JWT access token    |
| id            | Path   | Yes      | Record ID                  |

- **Status Codes:** 204 No Content, 404 Not Found, 401 Unauthorized

**cURL:**
```bash
curl -X DELETE http://localhost:8010/api/v1/patient/records/REC001/ \
  -H "Authorization: Bearer <token>"
```

**Postman:**
```json
{
  "method": "DELETE",
  "url": "http://localhost:8010/api/v1/patient/records/REC001/",
  "headers": [{"key": "Authorization", "value": "Bearer <token>"}]
}
```

**Notes:**
- Returns 404 if the record does not exist.
- Returns 204 on successful deletion.

---

#### 7.4 Help Center

**Endpoint:** `/api/v1/patient/help/` (GET)

- **Purpose:** Get help center/FAQ for patients.
- **Frontend Page:** Patient Help Center

| Input         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| Authorization | Header | No       | Bearer JWT access token    |

| Output Field | Type   | Description                  |
|--------------|--------|------------------------------|
| help         | array  | List of help/FAQ entries     |

- **Status Codes:** 200 OK

**cURL:**
```bash
curl -X GET http://localhost:8010/api/v1/patient/help/
```

**Postman:**
```json
{
  "method": "GET",
  "url": "http://localhost:8010/api/v1/patient/help/"
}
```

**Notes:**
- Help center is public, but may return more info if user is authenticated.

--- 