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

---

## Database Design

**Database Choice:** PostgreSQL

**Reason:** PostgreSQL is chosen for this system because it provides relational data structure, ACID compliance, strong indexing capabilities, and reliability for structured student notification records. It ensures data integrity and query performance for large-scale notification systems.

### Notifications Table Schema

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | auto-increment primary key |
| student_id | INTEGER | references students table |
| type | VARCHAR | Placement / Result / Event |
| message | TEXT | notification content |
| is_read | BOOLEAN | default false |
| created_at | TIMESTAMP | default NOW() |

---

## Scaling Concerns

- **Large table scans slow down** as rows grow into millions. Without proper indexing, querying can become prohibitively slow.
- **Fetching unread notifications without indexes causes full scans.** This is a common operation that must be optimized.
- **Pagination is essential** to avoid loading all rows at once. Sending millions of records to the client degrades performance.
- **Indexes must be added** on frequently filtered columns such as `student_id`, `is_read`, and `created_at` to ensure efficient queries.

---

## Sample Query

```sql
SELECT * FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at DESC
LIMIT 20;
```

This query fetches the 20 most recent unread notifications for a specific student, ordered by creation time in descending order.

---

## Query Optimization

### Problem Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

**Problem:** This query causes a full table scan. With millions of rows, this query becomes extremely slow because there is no index on `studentID`, `isRead`, or `createdAt`. The database engine must examine every single row to find matches, leading to significant performance degradation.

### Solution — Composite Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

**Why this works:** The composite index covers all three columns used in the WHERE and ORDER BY clauses. This allows the database engine to skip the full table scan entirely and instead navigate directly to the matching rows through the index, resulting in orders of magnitude faster query execution.

---

## Why Not Index Everything?

- **Each index slows down INSERT and UPDATE operations.** Every time data is modified, all indexes must also be updated, adding overhead.
- **Indexes consume additional disk storage.** Large indexes on big tables can consume significant disk space.
- **Only index columns used frequently in WHERE or ORDER BY clauses.** Unnecessary indexes provide no benefit and only add cost.

---

## Placement-Specific Query

```sql
SELECT *
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

This query efficiently retrieves all placement notifications from the last 7 days. For best performance, an index should be created on `(notificationType, createdAt)` to optimize this frequently-used query.
