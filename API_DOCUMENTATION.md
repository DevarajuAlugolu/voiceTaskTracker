# 📚 **Voice-Enabled Task Tracker - API Documentation**

## **Base URL**

```
http://localhost:4000/api
```

---

## **Authentication**

Currently **no authentication required** (single-user app).

---

# 🎯 **Task Management Endpoints**

## **1. Get All Tasks**

### Request

```http
GET /tasks?status=todo&priority=high&search=review&dueFrom=2025-12-06&dueTo=2025-12-15
```

### Query Parameters

| Parameter  | Type     | Required | Description                                             | Example               |
| ---------- | -------- | -------- | ------------------------------------------------------- | --------------------- |
| `status`   | string   | No       | Filter by status: `todo`, `in_progress`, `done`         | `?status=in_progress` |
| `priority` | string   | No       | Filter by priority: `low`, `medium`, `high`, `critical` | `?priority=high`      |
| `search`   | string   | No       | Search by title or description (case-insensitive)       | `?search=bug`         |
| `dueFrom`  | ISO date | No       | Filter tasks due from this date (inclusive)             | `?dueFrom=2025-12-06` |
| `dueTo`    | ISO date | No       | Filter tasks due until this date (inclusive)            | `?dueTo=2025-12-15`   |

### Response

**Success (200 OK)**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Review pull request",
    "description": "Check authentication module changes",
    "status": "todo",
    "priority": "high",
    "due_date": "2025-12-06T18:00:00.000Z",
    "created_at": "2025-12-05T10:30:00.000Z",
    "updated_at": "2025-12-05T10:30:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Fix login bug",
    "description": null,
    "status": "in_progress",
    "priority": "critical",
    "due_date": "2025-12-06T09:00:00.000Z",
    "created_at": "2025-12-04T14:20:00.000Z",
    "updated_at": "2025-12-05T08:15:00.000Z"
  }
]
```

### Error Responses

**Bad Request (400)**

```json
{
  "message": "Invalid filter parameter"
}
```

**Server Error (500)**

```json
{
  "message": "Database connection failed"
}
```

### Example Requests

```bash
# Get all tasks
curl "http://localhost:4000/api/tasks"

# Get only urgent tasks
curl "http://localhost:4000/api/tasks?priority=critical"

# Get in-progress tasks due this week
curl "http://localhost:4000/api/tasks?status=in_progress&dueFrom=2025-12-06&dueTo=2025-12-12"

# Search for "code review"
curl "http://localhost:4000/api/tasks?search=code%20review"

# Combine filters
curl "http://localhost:4000/api/tasks?status=todo&priority=high&search=urgent"
```

---

## **2. Get Single Task**

### Request

```http
GET /tasks/:id
```

### Path Parameters

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `id`      | UUID | Yes      | Task ID     |

### Response

**Success (200 OK)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Review pull request",
  "description": "Check authentication module changes",
  "status": "todo",
  "priority": "high",
  "due_date": "2025-12-06T18:00:00.000Z",
  "created_at": "2025-12-05T10:30:00.000Z",
  "updated_at": "2025-12-05T10:30:00.000Z"
}
```

**Not Found (404)**

```json
{
  "message": "Task not found"
}
```

### Example Request

```bash
curl "http://localhost:4000/api/tasks/550e8400-e29b-41d4-a716-446655440000"
```

---

## **3. Create Task**

### Request

```http
POST /tasks
Content-Type: application/json
```

### Body Parameters

| Field         | Type         | Required | Constraints                         | Example                  |
| ------------- | ------------ | -------- | ----------------------------------- | ------------------------ |
| `title`       | string       | Yes      | 1-255 chars, non-empty              | `"Review PR"`            |
| `description` | string       | No       | 0-5000 chars                        | `"Check auth changes"`   |
| `priority`    | string       | No       | `low`, `medium`, `high`, `critical` | `"high"`                 |
| `status`      | string       | No       | `todo`, `in_progress`, `done`       | `"todo"`                 |
| `dueDate`     | ISO datetime | No       | Valid ISO 8601 format               | `"2025-12-06T18:00:00Z"` |

### Response

**Created (201)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Review pull request",
  "description": "Check authentication module changes",
  "status": "todo",
  "priority": "high",
  "due_date": "2025-12-06T18:00:00.000Z",
  "created_at": "2025-12-05T10:30:00.000Z",
  "updated_at": "2025-12-05T10:30:00.000Z"
}
```

**Bad Request (400)**

```json
{
  "message": "Title is required"
}
```

### Example Requests

```bash
# Minimal task
curl -X POST "http://localhost:4000/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix login bug"
  }'

# Complete task
curl -X POST "http://localhost:4000/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review pull request",
    "description": "Check authentication module changes",
    "priority": "high",
    "status": "todo",
    "dueDate": "2025-12-06T18:00:00Z"
  }'
```

---

## **4. Update Task**

### Request

```http
PUT /tasks/:id
Content-Type: application/json
```

### Path Parameters

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `id`      | UUID | Yes      | Task ID     |

### Body Parameters (All Optional)

| Field         | Type         | Constraints                         | Example                  |
| ------------- | ------------ | ----------------------------------- | ------------------------ |
| `title`       | string       | 1-255 chars                         | `"Updated title"`        |
| `description` | string       | 0-5000 chars                        | `"New description"`      |
| `priority`    | string       | `low`, `medium`, `high`, `critical` | `"critical"`             |
| `status`      | string       | `todo`, `in_progress`, `done`       | `"in_progress"`          |
| `dueDate`     | ISO datetime | Valid ISO 8601 or null              | `"2025-12-07T09:00:00Z"` |

### Response

**Success (200)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress",
  "priority": "critical",
  "due_date": "2025-12-07T09:00:00.000Z",
  "created_at": "2025-12-05T10:30:00.000Z",
  "updated_at": "2025-12-05T11:45:00.000Z"
}
```

**Not Found (404)**

```json
{
  "message": "Task not found"
}
```

**Bad Request (400)**

```json
{
  "message": "Invalid status"
}
```

### Example Requests

```bash
# Update single field
curl -X PUT "http://localhost:4000/api/tasks/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'

# Update multiple fields
curl -X PUT "http://localhost:4000/api/tasks/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New title",
    "priority": "critical",
    "status": "done",
    "dueDate": "2025-12-10T18:00:00Z"
  }'

# Clear due date
curl -X PUT "http://localhost:4000/api/tasks/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "dueDate": null
  }'
```

---

## **5. Delete Task**

### Request

```http
DELETE /tasks/:id
```

### Path Parameters

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `id`      | UUID | Yes      | Task ID     |

### Response

**Success (200)**

```json
{
  "message": "Task deleted successfully"
}
```

**Not Found (404)**

```json
{
  "message": "Task not found"
}
```

### Example Request

```bash
curl -X DELETE "http://localhost:4000/api/tasks/550e8400-e29b-41d4-a716-446655440000"
```

---

# 🎤 **Voice Parsing Endpoints**

## **6. Parse Voice Transcript**

### Request

```http
POST /voice/parse
Content-Type: application/json
```

### Body Parameters

| Field        | Type   | Required | Description                  | Example                          |
| ------------ | ------ | -------- | ---------------------------- | -------------------------------- |
| `transcript` | string | Yes      | Raw voice-to-text transcript | `"Create urgent task by Friday"` |

### Response

**Success (200)**

```json
{
  "transcript": "Create urgent task to review code by Friday morning",
  "parsed": {
    "title": "review code",
    "priority": "high",
    "status": "todo",
    "dueDate": "2025-12-12T09:00:00.000Z"
  }
}
```

**Bad Request (400)**

```json
{
  "message": "transcript is required"
}
```

**Server Error (500)**

```json
{
  "message": "Failed to parse transcript with AI"
}
```

### Supported Formats

**Priority Keywords:**

- `low`, `low priority` → `low`
- `medium`, `normal` → `medium`
- `high`, `urgent`, `important` → `high`
- `critical`, `very high`, `asap` → `critical`

**Status Keywords:**

- `todo`, `to do` → `todo`
- `in progress`, `doing` → `in_progress`
- `done`, `completed`, `finished` → `done`

**Date Phrases:**

- `tomorrow` → next day
- `day after tomorrow` → +2 days
- `next Monday`, `next Friday` → upcoming weekday
- `in 3 days`, `in 2 weeks` → relative offset
- `January 15`, `15th Jan` → absolute date
- `morning` (9 AM), `afternoon` (3 PM), `evening` (6 PM), `night` (9 PM)

### Example Requests

```bash
# Simple task
curl -X POST "http://localhost:4000/api/voice/parse" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Create task to review code"
  }'

# Complex voice input
curl -X POST "http://localhost:4000/api/voice/parse" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Urgent: fix the login bug by next Friday morning, critical priority"
  }'

# With relative date
curl -X POST "http://localhost:4000/api/voice/parse" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Low priority: update documentation in 2 weeks"
  }'
```

---

## **7. Create Task from Voice** (Optional)

### Request

```http
POST /voice/create-from-voice
Content-Type: application/json
```

### Body Parameters

| Field        | Type   | Required | Description          |
| ------------ | ------ | -------- | -------------------- |
| `transcript` | string | Yes      | Raw voice transcript |

### Response

**Created (201)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "review code",
  "description": null,
  "status": "todo",
  "priority": "high",
  "due_date": "2025-12-12T09:00:00.000Z",
  "created_at": "2025-12-05T10:30:00.000Z",
  "updated_at": "2025-12-05T10:30:00.000Z"
}
```

### Example Request

```bash
curl -X POST "http://localhost:4000/api/voice/create-from-voice" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Create high priority task to review code by Friday"
  }'
```

---

# 📋 **Data Formats**

## **Status Values**

```
- "todo" → To Do
- "in_progress" → In Progress
- "done" → Done
```

## **Priority Values**

```
- "low" → Low Priority
- "medium" → Medium Priority
- "high" → High Priority
- "critical" → Critical/Urgent
```

## **Date Format**

```
ISO 8601: 2025-12-06T18:00:00.000Z
```

---

# ⚡ **HTTP Status Codes**

| Code    | Meaning      | Use Case                              |
| ------- | ------------ | ------------------------------------- |
| **200** | OK           | Successful GET, PUT, DELETE           |
| **201** | Created      | Task successfully created (POST)      |
| **400** | Bad Request  | Invalid input, missing required field |
| **404** | Not Found    | Task ID doesn't exist                 |
| **500** | Server Error | Database or parsing error             |

---

# 🔗 **Sample API Flows**

### **Flow 1: Create Task Manually**

```bash
POST /tasks
{
  "title": "Review PR",
  "priority": "high",
  "dueDate": "2025-12-06T18:00:00Z"
}
→ 201 Created
```

### **Flow 2: Voice to Task**

```bash
POST /voice/parse
{
  "transcript": "urgent task by Friday"
}
→ 200 OK with parsed data

POST /tasks
{...parsed data...}
→ 201 Created
```

### **Flow 3: Update Task Status**

```bash
PUT /tasks/:id
{
  "status": "in_progress"
}
→ 200 OK
```

### **Flow 4: Delete Task**

```bash
DELETE /tasks/:id
→ 200 OK
```

---

# 📞 **Error Handling**

All errors return JSON with a `message` field:

```json
{
  "message": "Error description here"
}
```

**Common Errors:**

| Error                        | Cause                | Fix                                     |
| ---------------------------- | -------------------- | --------------------------------------- |
| `Title is required`          | Empty/missing title  | Add `title` field                       |
| `Invalid status`             | Wrong status value   | Use `todo`, `in_progress`, `done`       |
| `Invalid priority`           | Wrong priority value | Use `low`, `medium`, `high`, `critical` |
| `Invalid dueDate`            | Malformed date       | Use ISO 8601 format                     |
| `Task not found`             | ID doesn't exist     | Check task ID                           |
| `Failed to parse transcript` | AI error             | Retry or use manual form                |

---
