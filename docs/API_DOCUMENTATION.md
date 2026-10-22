# REST API & SSE Streaming Specification

## Base URL
- Local Dev Server: `http://localhost:8080`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`

---

## 1. Authentication Endpoints

### Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "fullName": "Alex Johnson",
  "email": "student@university.edu",
  "password": "Password@123",
  "role": "STUDENT",
  "departmentId": 1,
  "currentSemester": 4,
  "studentIdNumber": "CS-2023-042"
}
```
- **Response** (`200 OK`):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 2,
    "email": "student@university.edu",
    "fullName": "Alex Johnson",
    "role": "STUDENT",
    "departmentId": 1,
    "currentSemester": 4,
    "studentIdNumber": "CS-2023-042"
  }
}
```

### Login
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Request Body**:
```json
{
  "email": "student@university.edu",
  "password": "Student@123456"
}
```

### Refresh Token
- **Method**: `POST`
- **Path**: `/api/auth/refresh`
- **Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

## 2. Chat & Streaming RAG Endpoints

### Create Conversation
- **Method**: `POST`
- **Path**: `/api/chat/conversations`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "title": "Attendance Policy for CS201"
}
```

### Get User Conversations
- **Method**: `GET`
- **Path**: `/api/chat/conversations`
- **Headers**: `Authorization: Bearer <token>`

### Stream Message (Server-Sent Events)
- **Method**: `POST`
- **Path**: `/api/chat/conversations/{id}/messages/stream`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Accept: text/event-stream`
- **Request Body**:
```json
{
  "content": "What is the attendance requirement to take semester exams?"
}
```
- **SSE Stream Output**:
```text
event: citations
data: [{"documentTitle":"Academic Regulations 2025-2026","pageNumber":14,"snippet":"Section 4.2: 75% attendance mandatory...","relevanceScore":0.94}]

data: {"delta":"According "}
data: {"delta":"to "}
data: {"delta":"official "}
data: {"delta":"Section 4.2..."}

data: [DONE]
```

---

## 3. Academic Resources Catalog

### List Departments
- **Method**: `GET`
- **Path**: `/api/academic/departments`

### List Courses
- **Method**: `GET`
- **Path**: `/api/academic/courses?departmentId=1`

### List Subjects
- **Method**: `GET`
- **Path**: `/api/academic/subjects?courseId=1&semester=4`

---

## 4. Administration & Document Ingestion

### Upload Document
- **Method**: `POST`
- **Path**: `/api/admin/documents`
- **Headers**:
  - `Authorization: Bearer <admin-token>`
  - `Content-Type: multipart/form-data`
- **Form Data**:
  - `file`: (binary PDF/DOCX/TXT)
  - `title`: "Examination Manual 2026"
  - `category`: "EXAM"
  - `accessLevel`: "STUDENT"
  - `academicYear`: "2025-2026"

### Trigger Reindex
- **Method**: `POST`
- **Path**: `/api/admin/documents/{id}/reindex`
- **Headers**: `Authorization: Bearer <admin-token>`

### List Background Ingestion Jobs
- **Method**: `GET`
- **Path**: `/api/admin/ingestion/jobs`
- **Headers**: `Authorization: Bearer <admin-token>`
