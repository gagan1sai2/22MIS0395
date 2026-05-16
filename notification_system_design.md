# Notification System Design

This system provides a full-stack notification platform with a Node.js logging middleware, an Express.js backend REST API, and a React frontend built with Vite. The architecture separates concerns into three folders: `logging_middleware` for logging utilities, `notification_app_be` for backend services, and `notification_app_fe` for the user interface. The backend serves notification data and the frontend consumes it, while the middleware logs requests and events across the system.

## API Endpoints

### Endpoint 1 — Get all notifications

**Method:** GET  
**Path:** `/notifications`  
**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of notifications per page
- `notification_type` (optional): Filter by notification type

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "student_id": "22MIS0395",
      "type": "interview",
      "message": "Interview scheduled for tomorrow",
      "is_read": false,
      "created_at": "2026-05-16T10:30:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

---

### Endpoint 2 — Create notification

**Method:** POST  
**Path:** `/notifications`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "student_id": "22MIS0395",
  "type": "interview",
  "message": "Interview Notification"
}
```

**Response:**
```json
{
  "id": 1,
  "student_id": "22MIS0395",
  "type": "interview",
  "message": "Interview Notification",
  "is_read": false,
  "created_at": "2026-05-16T10:30:00Z"
}
```

---

### Endpoint 3 — Mark notification as read

**Method:** PATCH  
**Path:** `/notifications/:id/read`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

---

### Endpoint 4 — Delete notification

**Method:** DELETE  
**Path:** `/notifications/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

---

## Real-time Mechanism

Use WebSockets or Server-Sent Events (SSE) to push new notifications to connected clients without polling. This ensures that users receive notifications instantly as they are created, improving the user experience and reducing server load by eliminating the need for continuous polling requests.
