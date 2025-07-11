import express from 'express';
import { isAdmin, isAuth } from '../middlewares/isAuth.js';
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
} from '../controllers/admin.js';
import { uploadFiles } from '../middlewares/multer.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin - Courses
 *     description: Admin course management endpoints (requires admin role)
 *   - name: Admin - Lectures
 *     description: Admin lecture management endpoints (requires admin role)
 *   - name: Admin - Users
 *     description: Admin user management endpoints (requires admin role)
 *   - name: Admin - Statistics
 *     description: Admin statistics and analytics endpoints (requires admin role)
 */

/**
 * @swagger
 * /api/course/new:
 *   post:
 *     tags: [Admin - Courses]
 *     summary: Create a new course
 *     description: Creates a new course with image upload (admin only)
 *     security:
 *       - TokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, price, duration, category, createdBy, file]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Course title
 *                 example: "Complete Web Development Bootcamp"
 *               description:
 *                 type: string
 *                 description: Course description
 *                 example: "Learn full-stack web development from scratch"
 *               price:
 *                 type: number
 *                 description: Course price
 *                 example: 99.99
 *               duration:
 *                 type: number
 *                 description: Course duration in hours
 *                 example: 40
 *               category:
 *                 type: string
 *                 description: Course category
 *                 example: "Web Development"
 *               createdBy:
 *                 type: string
 *                 description: Course creator name
 *                 example: "Dr. Jane Smith"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Course thumbnail image
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Course created successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You are not admin"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/course/new', isAuth, isAdmin, uploadFiles, createCourse);

/**
 * @swagger
 * /api/course/{id}:
 *   post:
 *     tags: [Admin - Lectures]
 *     summary: Add lecture to course
 *     description: Adds a new lecture with video upload to an existing course (admin only)
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID to add lecture to
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, file]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Lecture title
 *                 example: "Introduction to JavaScript"
 *               description:
 *                 type: string
 *                 description: Lecture description
 *                 example: "Learn the basics of JavaScript programming"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Lecture video file
 *     responses:
 *       201:
 *         description: Lecture added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LectureCreateResponse'
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "No Course with this id"
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You are not admin"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/course/:id', isAuth, isAdmin, uploadFiles, addLectures);
/**
 * @swagger
 * /api/course/{id}:
 *   delete:
 *     tags: [Admin - Courses]
 *     summary: Delete course
 *     description: Deletes a course and all its associated lectures (admin only)
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Course deleted successfully"
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You are not admin"
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
router.delete('/course/:id', isAuth, isAdmin, deleteCourse);

/**
 * @swagger
 * /api/lecture/{id}:
 *   delete:
 *     tags: [Admin - Lectures]
 *     summary: Delete lecture
 *     description: Deletes a specific lecture and its video file (admin only)
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID to delete
 *         example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Lecture deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Lecture deleted successfully"
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You are not admin"
 *       404:
 *         description: Lecture not found
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
router.delete('/lecture/:id', isAuth, isAdmin, deleteLecture);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     tags: [Admin - Statistics]
 *     summary: Get platform statistics
 *     description: Retrieves overall platform statistics including total courses, lectures, and users (admin only)
 *     security:
 *       - TokenAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Statistics'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You are not admin"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', isAuth, isAdmin, getAllStats);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     tags: [Admin - Users]
 *     summary: Update user role
 *     description: Updates user role between 'user' and 'admin' (super admin only)
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update role for
 *         example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Role updated successfully"
 *       403:
 *         description: Super admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "This endpoint is assin to superadmin"
 *       404:
 *         description: User not found
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
router.put('/user/:id', isAuth, updateRole);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Admin - Users]
 *     summary: Get all users
 *     description: Retrieves all users except the current admin user (admin only)
 *     security:
 *       - TokenAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "You are not admin"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/users', isAuth, isAdmin, getAllUser);

export default router;
