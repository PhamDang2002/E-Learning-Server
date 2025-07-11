# E-Learning Server API Documentation

## Overview

This document provides comprehensive information about the E-Learning Server API, including interactive Swagger/OpenAPI documentation that has been integrated into the server.

## API Documentation Access

### Interactive Swagger UI
- **URL**: `http://localhost:5000/api-docs`
- **Description**: Interactive web interface for exploring and testing API endpoints
- **Features**:
  - Browse all available endpoints organized by tags
  - View detailed request/response schemas
  - Test API endpoints directly from the browser
  - Authentication support for protected endpoints

### JSON Specification
- **URL**: `http://localhost:5000/api-docs.json`
- **Description**: Raw OpenAPI 3.0 specification in JSON format
- **Use Cases**: Import into API testing tools, generate client SDKs, automated testing

## API Categories

### 🔐 Authentication
- **POST** `/api/user/register` - Register new user account
- **POST** `/api/user/verify` - Verify user account with OTP
- **POST** `/api/user/login` - User login and JWT token generation
- **POST** `/api/user/forgot` - Request password reset
- **POST** `/api/user/reset` - Reset password with token

### 👤 Users
- **GET** `/api/user/me` - Get current user profile
- **PUT** `/api/user/{id}` - Update user role (admin only)
- **GET** `/api/users` - Get all users (admin only)

### 📚 Courses
- **GET** `/api/course/all` - Get all available courses
- **GET** `/api/course/{id}` - Get specific course details
- **GET** `/api/mycourse` - Get user's enrolled courses
- **POST** `/api/course/new` - Create new course (admin only)
- **DELETE** `/api/course/{id}` - Delete course (admin only)

### 🎥 Lectures
- **GET** `/api/lectures/{id}` - Get course lectures (requires subscription)
- **GET** `/api/lecture/{id}` - Get specific lecture (requires subscription)
- **POST** `/api/course/{id}` - Add lecture to course (admin only)
- **DELETE** `/api/lecture/{id}` - Delete lecture (admin only)

### 💳 Payment
- **POST** `/api/create-payment-link` - Create payment link
- **POST** `/api/course/checkout/{id}` - Initiate course checkout
- **POST** `/api/verification/{id}` - Verify payment and enroll
- **POST** `/receive-hook` - Payment webhook

### 📊 Progress
- **POST** `/api/user/progress` - Mark lecture as completed
- **GET** `/api/user/progress` - Get user's course progress

### 🛠️ Admin
- **GET** `/api/stats` - Get platform statistics
- **GET** `/api/users` - Get all users
- **PUT** `/api/user/{id}` - Update user roles

## Authentication

Most API endpoints require authentication using JWT tokens. 

### How to Authenticate:
1. **Login**: Use `POST /api/user/login` to get a JWT token
2. **Include Token**: Add the token to the `token` header in subsequent requests
3. **Header Format**: `token: your_jwt_token_here`

### Example:
```bash
# Login to get token
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Use token in authenticated request
curl -X GET http://localhost:5000/api/user/me \
  -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## File Uploads

Endpoints that accept file uploads use `multipart/form-data` encoding:
- **Field Name**: `file`
- **Supported Types**: Images (for courses), Videos (for lectures)
- **Examples**: Course creation, lecture addition

## Response Formats

### Success Response
```json
{
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

### Data Response
```json
{
  "courses": [...],
  "user": {...},
  "lectures": [...]
}
```

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## Testing the API

### Using Swagger UI
1. Open `http://localhost:5000/api-docs` in your browser
2. Click on any endpoint to expand details
3. Click "Try it out" to test the endpoint
4. Fill in required parameters and request body
5. Click "Execute" to send the request
6. View the response in the interface

### Using curl
```bash
# Get all courses
curl -X GET http://localhost:5000/api/course/all

# Register new user
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

### Using Postman
1. Import the OpenAPI specification from `http://localhost:5000/api-docs.json`
2. Postman will automatically create a collection with all endpoints
3. Set up authentication by adding the `token` header
4. Test endpoints directly from Postman

## Development

### Adding New Endpoints
1. Add the endpoint to your Express routes
2. Update `swagger.json` with the new endpoint documentation
3. Include proper request/response schemas
4. Test the endpoint in Swagger UI

### Updating Documentation
- Edit `swagger.json` to modify API documentation
- Server will automatically reload with changes
- Refresh Swagger UI to see updates

## Files Structure

```
├── swagger.json          # OpenAPI specification
├── swagger.config.js     # Swagger configuration
├── index.js             # Main server file with Swagger integration
└── API_DOCUMENTATION.md # This documentation file
```

## Support

For API support or questions:
- Check the interactive documentation at `/api-docs`
- Review this documentation
- Contact: support@elearning.com
