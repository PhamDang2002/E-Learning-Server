import express from 'express';
import {
  forgotPassword,
  loginUser,
  myProfile,
  register,
  resetPassword,
  verifyUser,
} from '../controllers/user.js';
import { isAuth } from '../middlewares/isAuth.js';
import { addProgress, getYourProgress } from '../controllers/course.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and account management endpoints
 *   - name: User Progress
 *     description: User course progress tracking endpoints
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user account
 *     description: Creates a new user account and sends an OTP to the provided email for verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *           example:
 *             name: "John Doe"
 *             email: "john.doe@example.com"
 *             password: "securePassword123"
 *     responses:
 *       200:
 *         description: Registration successful, OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: User already exists or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "User already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/user/register', register);

/**
 * @swagger
 * /api/user/verify:
 *   post:
 *     tags: [Authentication]
 *     summary: Verify user account with OTP
 *     description: Verifies the user account using the OTP sent to email during registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserVerify'
 *           example:
 *             otp: 123456
 *             activationToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "User Registered"
 *       400:
 *         description: Invalid OTP or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidOtp:
 *                 value:
 *                   message: "Wrong Otp"
 *               expiredToken:
 *                 value:
 *                   message: "Otp Expired"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/user/verify', verifyUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticates user credentials and returns JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *           example:
 *             email: "john.doe@example.com"
 *             password: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   message: "No User with this email"
 *               wrongPassword:
 *                 value:
 *                   message: "Wrong Password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/user/login', loginUser);

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user profile
 *     description: Retrieves the profile information of the authenticated user
 *     security:
 *       - TokenAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       403:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Please Login"
 *       500:
 *         description: Authentication error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Login First"
 */
router.get('/user/me', isAuth, myProfile);

/**
 * @swagger
 * /api/user/forgot:
 *   post:
 *     tags: [Authentication]
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *           example:
 *             email: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Reset Password Link is send to you mail"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "No User with this email"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/user/forgot', forgotPassword);

/**
 * @swagger
 * /api/user/reset:
 *   post:
 *     tags: [Authentication]
 *     summary: Reset user password
 *     description: Resets the user's password using the token from the reset email
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token from email
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *           example:
 *             password: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Password Reset"
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Token Expired"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "No user with this email"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/user/reset', resetPassword);
/**
 * @swagger
 * /api/user/progress:
 *   post:
 *     tags: [User Progress]
 *     summary: Add lecture progress
 *     description: Marks a lecture as completed for the authenticated user
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: query
 *         name: course
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID to mark as completed
 *         example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Progress already recorded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Progress recorded"
 *       201:
 *         description: New progress added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "New Progress added"
 *       403:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Please Login"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/user/progress', isAuth, addProgress);

/**
 * @swagger
 * /api/user/progress:
 *   get:
 *     tags: [User Progress]
 *     summary: Get user course progress
 *     description: Retrieves the progress information for a specific course
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: query
 *         name: course
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID to get progress for
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgressResponse'
 *       404:
 *         description: No progress found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "null"
 *       403:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Please Login"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/user/progress', isAuth, getYourProgress);

export default router;
