# E-Learning Platform API Documentation

## Overview

This document provides comprehensive information about the E-Learning Platform API, including authentication, endpoints, and usage examples. The API is built with Node.js, Express, and MongoDB, featuring JWT authentication and role-based access control.

## 🚀 Quick Start

### Accessing the Documentation

The interactive Swagger UI documentation is available at:

```
https://e-learning-server-ty2o.onrender.com/api-docs
```

### Authentication

Most endpoints require authentication using JWT tokens. Include the token in the `token` header:

```bash
curl -H "token: your_jwt_token_here" https://e-learning-server-ty2o.onrender.com/api/user/me
```

## 📚 API Endpoints Overview

### Authentication Endpoints

- `POST /api/user/register` - Register a new user
- `POST /api/user/verify` - Verify user account with OTP
- `POST /api/user/login` - User login
- `GET /api/user/me` - Get current user profile
- `POST /api/user/forgot` - Request password reset
- `POST /api/user/reset` - Reset password

### Course Management

- `GET /api/course/all` - Get all courses (public)
- `GET /api/course/:id` - Get single course (public)
- `GET /api/mycourse` - Get user's enrolled courses (authenticated)

### Lecture Access

- `GET /api/lectures/:id` - Get course lectures (requires subscription)
- `GET /api/lecture/:id` - Get single lecture (requires subscription)

### User Progress

- `POST /api/user/progress` - Add lecture progress
- `GET /api/user/progress` - Get course progress

### Payment Processing

- `POST /api/course/checkout/:id` - Initiate course checkout
- `POST /api/verification/:id` - Verify payment and enroll
- `POST /api/create-payment-link` - Create payment link
- `POST /receive-hook` - Payment webhook

### Admin Endpoints (Admin Role Required)

- `POST /api/course/new` - Create new course
- `POST /api/course/:id` - Add lecture to course
- `DELETE /api/course/:id` - Delete course
- `DELETE /api/lecture/:id` - Delete lecture
- `GET /api/stats` - Get platform statistics
- `GET /api/users` - Get all users
- `PUT /api/user/:id` - Update user role (Super Admin only)

## 🔐 Authentication Flow

### 1. User Registration

```bash
POST /api/user/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### 2. Account Verification

```bash
POST /api/user/verify
{
  "otp": 123456,
  "activationToken": "token_from_registration_response"
}
```

### 3. User Login

```bash
POST /api/user/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response includes JWT token for subsequent requests.

## 👥 User Roles

### User (Default)

- View public courses
- Enroll in courses
- Access subscribed content
- Track progress

### Admin

- All user permissions
- Create and manage courses
- Add/delete lectures
- View platform statistics
- Manage users

### Super Admin

- All admin permissions
- Update user roles
- System-level access

## 📊 Data Models

### User

```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "role": "user|admin",
  "mainrole": "user|superadmin",
  "subscription": ["courseId1", "courseId2"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Course

```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "image": "string",
  "price": "number",
  "duration": "number",
  "category": "string",
  "createdBy": "string",
  "createdAt": "datetime"
}
```

### Lecture

```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "video": "string",
  "course": "ObjectId",
  "createdAt": "datetime"
}
```

## 🔧 Testing with Swagger UI

1. **Access Documentation**: Navigate to `https://e-learning-server-ty2o.onrender.com/api-docs`

2. **Authenticate**:

   - Click "Authorize" button
   - Enter your JWT token in the "token" field
   - Click "Authorize"

3. **Test Endpoints**:
   - Expand any endpoint section
   - Click "Try it out"
   - Fill in required parameters
   - Click "Execute"

## 📝 Example Usage

### Complete User Journey

1. **Register and Verify Account**
2. **Login to Get Token**
3. **Browse Available Courses**
4. **Purchase Course**
5. **Access Course Content**
6. **Track Progress**

### Admin Workflow

1. **Login as Admin**
2. **Create New Course**
3. **Add Lectures to Course**
4. **Monitor Platform Statistics**
5. **Manage Users**

## 🚨 Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include descriptive messages:

```json
{
  "message": "Error description"
}
```

## 🔒 Security Features

- JWT token authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation
- File upload security
- CORS configuration

## 📈 Rate Limiting

API requests are rate-limited to prevent abuse. Standard limits apply per IP address.

## 🛠️ Development

### Environment Variables

```env
PORT=5000
Jwt_Sec=your_jwt_secret
Activation_Secret=your_activation_secret
Forgot_Secret=your_forgot_secret
Gmail=your_gmail_address
Password=your_gmail_password
frontendurl=https://your-frontend-url.com
```

### Running the Server

```bash
npm install
npm run dev
```

## 📞 Support

For API support and questions, contact the development team or refer to the interactive documentation at `/api-docs`.
