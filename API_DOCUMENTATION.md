# Birr Books API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user account
\`\`\`json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "User Name"
}

Response (201):
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "User Name",
    "verified": false
  }
}
\`\`\`

### POST /api/auth/login
Login to existing account
\`\`\`json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "token": "hex-token-string",
  "message": "Login successful"
}
\`\`\`

### POST /api/auth/verify-email
Verify email with OTP
\`\`\`json
Request:
{
  "email": "user@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "token": "hex-token-string",
  "message": "Email verified successfully"
}
\`\`\`

### POST /api/auth/logout
Logout from session
\`\`\`json
Request:
{
  "token": "hex-token-string"
}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
\`\`\`

---

## Shopping Endpoints

### GET /api/books
Get list of books with optional filters
\`\`\`json
Query Params:
- category: string (optional)
- authorId: string (optional)
- search: string (optional)

Response (200):
{
  "success": true,
  "books": [...]
}
\`\`\`

### POST /api/cart/add
Add item to cart
\`\`\`json
Headers:
Authorization: Bearer {token}

Request:
{
  "bookId": "book-123",
  "quantity": 1
}

Response (200):
{
  "success": true,
  "cart": { ... }
}
\`\`\`

---

## Error Responses

All errors follow this format:
\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
\`\`\`

Common status codes:
- 200: Success
- 201: Created
- 400: Bad request (validation error)
- 401: Unauthorized
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 409: Conflict (duplicate)
- 500: Server error

---

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user
- Returns 429 when exceeded

---

## Pagination
\`\`\`json
Query Params:
- page: number (default: 1)
- limit: number (default: 20, max: 100)

Response includes:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
\`\`\`
\`\`\`
