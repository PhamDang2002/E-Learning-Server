export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Learning Platform API',
      version: '1.0.0',
      description: `
        A comprehensive RESTful API for an e-learning platform built with Node.js, Express, and MongoDB.
        
        ## Features
        - User authentication and authorization with JWT
        - Role-based access control (User, Admin, Super Admin)
        - Course management and enrollment
        - Video lecture streaming
        - Progress tracking
        - Payment processing integration
        - Email notifications
        
        ## Authentication
        Most endpoints require authentication using JWT tokens. Include the token in the 'token' header.
        
        ## Rate Limiting
        API requests are rate-limited to prevent abuse. Standard limits apply per IP address.
      `,
      contact: {
        name: 'E-Learning Platform Support',
        email: 'support@elearning.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://your-production-domain.com'
            : `http://localhost:${process.env.PORT || 5000}`,
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint',
        },
        TokenAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'token',
          description: 'JWT token for authentication (used by this API)',
        },
      },
      schemas: {
        // User Schemas
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the user',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              description: 'Full name of the user',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
              example: 'john.doe@example.com',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'Role of the user in the system',
            },
            mainrole: {
              type: 'string',
              enum: ['user', 'superadmin'],
              default: 'user',
              description: 'Main role for super admin privileges',
            },
            subscription: {
              type: 'array',
              items: {
                type: 'string',
                description: 'Course ID',
              },
              description: 'Array of subscribed course IDs',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        UserRegister: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Full name of the user',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Valid email address',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password (minimum 6 characters)',
              example: 'securePassword123',
            },
          },
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Registered email address',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'securePassword123',
            },
          },
        },
        UserVerify: {
          type: 'object',
          required: ['otp', 'activationToken'],
          properties: {
            otp: {
              type: 'number',
              description: 'One-time password received via email',
              example: 123456,
            },
            activationToken: {
              type: 'string',
              description: 'Activation token received during registration',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        // Course Schemas
        Course: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the course',
              example: '507f1f77bcf86cd799439011',
            },
            title: {
              type: 'string',
              description: 'Course title',
              example: 'Complete Web Development Bootcamp',
            },
            description: {
              type: 'string',
              description: 'Detailed course description',
              example: 'Learn full-stack web development from scratch',
            },
            image: {
              type: 'string',
              description: 'Course thumbnail image path',
              example: 'uploads/course-image.jpg',
            },
            price: {
              type: 'number',
              description: 'Course price in currency units',
              example: 99.99,
            },
            duration: {
              type: 'number',
              description: 'Course duration in hours',
              example: 40,
            },
            category: {
              type: 'string',
              description: 'Course category',
              example: 'Web Development',
            },
            createdBy: {
              type: 'string',
              description: 'Name of the course creator',
              example: 'Dr. Jane Smith',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Course creation timestamp',
            },
          },
        },
        CourseCreate: {
          type: 'object',
          required: [
            'title',
            'description',
            'price',
            'duration',
            'category',
            'createdBy',
          ],
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Course title',
              example: 'Complete Web Development Bootcamp',
            },
            description: {
              type: 'string',
              minLength: 10,
              description: 'Detailed course description',
              example:
                'Learn full-stack web development from scratch including HTML, CSS, JavaScript, Node.js, and MongoDB',
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Course price',
              example: 99.99,
            },
            duration: {
              type: 'number',
              minimum: 1,
              description: 'Course duration in hours',
              example: 40,
            },
            category: {
              type: 'string',
              description: 'Course category',
              example: 'Web Development',
            },
            createdBy: {
              type: 'string',
              description: 'Name of the course creator',
              example: 'Dr. Jane Smith',
            },
          },
        },
        // Lecture Schemas
        Lecture: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the lecture',
              example: '507f1f77bcf86cd799439011',
            },
            title: {
              type: 'string',
              description: 'Lecture title',
              example: 'Introduction to JavaScript',
            },
            description: {
              type: 'string',
              description: 'Lecture description',
              example: 'Learn the basics of JavaScript programming',
            },
            video: {
              type: 'string',
              description: 'Video file path',
              example: 'uploads/lecture-video.mp4',
            },
            course: {
              type: 'string',
              description: 'Associated course ID',
              example: '507f1f77bcf86cd799439011',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Lecture creation timestamp',
            },
          },
        },
        LectureCreate: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Lecture title',
              example: 'Introduction to JavaScript',
            },
            description: {
              type: 'string',
              minLength: 10,
              description: 'Lecture description',
              example:
                'Learn the basics of JavaScript programming including variables, functions, and control structures',
            },
          },
        },
        // Progress Schema
        Progress: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the progress record',
            },
            course: {
              type: 'string',
              description: 'Course ID',
              example: '507f1f77bcf86cd799439011',
            },
            completedLectures: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Array of completed lecture IDs',
            },
            user: {
              type: 'string',
              description: 'User ID',
              example: '507f1f77bcf86cd799439011',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Response Schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'An error occurred',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Welcome back John Doe',
            },
            token: {
              type: 'string',
              description: 'JWT authentication token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'OTP sent to your email',
            },
            activationToken: {
              type: 'string',
              description: 'Token for account activation',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        // Payment Schemas
        Payment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the payment',
            },
            razorpay_order_id: {
              type: 'string',
              description: 'Razorpay order ID',
              example: 'order_1234567890',
            },
            razorpay_payment_id: {
              type: 'string',
              description: 'Razorpay payment ID',
              example: 'pay_1234567890',
            },
            razorpay_signature: {
              type: 'string',
              description: 'Razorpay signature for verification',
              example: 'signature_hash_string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Payment creation timestamp',
            },
          },
        },
        PaymentLink: {
          type: 'object',
          required: ['amount', 'description'],
          properties: {
            amount: {
              type: 'number',
              minimum: 1,
              description: 'Payment amount',
              example: 9999,
            },
            description: {
              type: 'string',
              minLength: 3,
              description: 'Payment description',
              example: 'Course enrollment payment',
            },
          },
        },
        PaymentLinkResponse: {
          type: 'object',
          properties: {
            checkoutUrl: {
              type: 'string',
              format: 'uri',
              description: 'Payment checkout URL',
              example: 'https://payment.gateway.com/checkout/xyz123',
            },
            orderCode: {
              type: 'number',
              description: 'Generated order code',
              example: 1234,
            },
          },
        },
        // Statistics Schema
        Statistics: {
          type: 'object',
          properties: {
            stats: {
              type: 'object',
              properties: {
                totalCourses: {
                  type: 'number',
                  description: 'Total number of courses',
                  example: 25,
                },
                totalLectures: {
                  type: 'number',
                  description: 'Total number of lectures',
                  example: 150,
                },
                totalUsers: {
                  type: 'number',
                  description: 'Total number of users',
                  example: 500,
                },
              },
            },
          },
        },
        // Progress Response Schema
        ProgressResponse: {
          type: 'object',
          properties: {
            courseProgressPercentage: {
              type: 'number',
              description: 'Course completion percentage',
              example: 75.5,
            },
            completedLectures: {
              type: 'number',
              description: 'Number of completed lectures',
              example: 15,
            },
            allLectures: {
              type: 'number',
              description: 'Total number of lectures in course',
              example: 20,
            },
            progress: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Progress',
              },
            },
          },
        },
        // Forgot Password Schema
        ForgotPassword: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Registered email address',
              example: 'john.doe@example.com',
            },
          },
        },
        ResetPassword: {
          type: 'object',
          required: ['password'],
          properties: {
            password: {
              type: 'string',
              minLength: 6,
              description: 'New password',
              example: 'newSecurePassword123',
            },
          },
        },
        // Collection Response Schemas
        CoursesResponse: {
          type: 'object',
          properties: {
            courses: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Course',
              },
            },
          },
        },
        CourseResponse: {
          type: 'object',
          properties: {
            course: {
              $ref: '#/components/schemas/Course',
            },
          },
        },
        LecturesResponse: {
          type: 'object',
          properties: {
            lectures: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Lecture',
              },
            },
          },
        },
        LectureResponse: {
          type: 'object',
          properties: {
            lecture: {
              $ref: '#/components/schemas/Lecture',
            },
          },
        },
        UsersResponse: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        LectureCreateResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Lecture added successfully',
            },
            lecture: {
              $ref: '#/components/schemas/Lecture',
            },
          },
        },
        // Additional Error Response Schemas
        ValidationError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Validation error message',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Email is required',
                  },
                },
              },
            },
          },
        },
        UnauthorizedError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Please Login',
            },
          },
        },
        ForbiddenError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'You are not admin',
            },
          },
        },
        NotFoundError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Resource not found',
            },
          },
        },
        RateLimitError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Too many requests, please try again later',
            },
            retryAfter: {
              type: 'number',
              description: 'Seconds to wait before retrying',
              example: 60,
            },
          },
        },
        ServerError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Internal server error',
            },
            error: {
              type: 'string',
              description: 'Error details (only in development)',
              example: 'Database connection failed',
            },
          },
        },
      },
    },
    security: [
      {
        TokenAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js', './index.js'],
};
