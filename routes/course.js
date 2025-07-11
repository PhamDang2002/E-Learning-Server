import express from 'express';
import {
  getAllCourses,
  getSingleCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  checkout,
  paymentVerification,
} from '../controllers/course.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Courses
 *     description: Course management and enrollment endpoints
 *   - name: Lectures
 *     description: Lecture access and management endpoints
 *   - name: Payments
 *     description: Course payment and enrollment endpoints
 */
/**
 * @swagger
 * /api/course/all:
 *   get:
 *     tags: [Courses]
 *     summary: Get all courses
 *     description: Retrieves a list of all available courses in the platform
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoursesResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/course/all', getAllCourses);

/**
 * @swagger
 * /api/course/{id}:
 *   get:
 *     tags: [Courses]
 *     summary: Get single course
 *     description: Retrieves detailed information about a specific course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseResponse'
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/course/:id', getSingleCourse);

/**
 * @swagger
 * /api/lectures/{id}:
 *   get:
 *     tags: [Lectures]
 *     summary: Get course lectures
 *     description: Retrieves all lectures for a specific course (requires subscription or admin role)
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Lectures retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LecturesResponse'
 *       400:
 *         description: Not subscribed to course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You have not subscribed to this course"
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
router.get('/lectures/:id', isAuth, fetchLectures);

/**
 * @swagger
 * /api/lecture/{id}:
 *   get:
 *     tags: [Lectures]
 *     summary: Get single lecture
 *     description: Retrieves a specific lecture (requires subscription to the course or admin role)
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *         example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Lecture retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LectureResponse'
 *       400:
 *         description: Not subscribed to course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You have not subscribed to this course"
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
router.get('/lecture/:id', isAuth, fetchLecture);

/**
 * @swagger
 * /api/mycourse:
 *   get:
 *     tags: [Courses]
 *     summary: Get user's enrolled courses
 *     description: Retrieves all courses that the authenticated user has subscribed to
 *     security:
 *       - TokenAuth: []
 *     responses:
 *       200:
 *         description: User courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoursesResponse'
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
router.get('/mycourse', isAuth, getMyCourses);

/**
 * @swagger
 * /api/course/checkout/{id}:
 *   post:
 *     tags: [Payments]
 *     summary: Initiate course checkout
 *     description: Creates a payment order for course enrollment
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID to purchase
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Payment order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   type: object
 *                   description: Payment order details
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: User already has this course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You already have this course"
 *       403:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Please Login"
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/course/checkout/:id', isAuth, checkout);

/**
 * @swagger
 * /api/verification/{id}:
 *   post:
 *     tags: [Payments]
 *     summary: Verify course payment
 *     description: Verifies payment and enrolls user in the course
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID to verify payment for
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Payment verified and course enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Course Verified and Added Successfully"
 *       400:
 *         description: User already has this course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You already have this course"
 *       403:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Please Login"
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Course not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/verification/:id', isAuth, paymentVerification);

export default router;
