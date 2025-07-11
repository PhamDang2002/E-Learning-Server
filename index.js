import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import PayOS from '@payos/node';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './config/swagger.js';

dotenv.config();

export const payos = new PayOS(
  '8e2d87dd-616c-4f44-ae6b-34931597c7b7',
  '7d968734-5608-4f00-a5ff-5247c55e8d39',
  '157b118b1793fd17721fd1b4494feda58420f226760cf458e31cf7d1a603a974',
);

const app = express();

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization'], // Thêm header Authorization nếu bạn dùng token
  credentials: true, // Cho phép gửi cookie nếu cần
};

app.use(cors(corsOptions)); // Apply CORS configuration

app.use(express.static('public'));
app.use(express.json());

const CLIENT_DOMAIN = `${process.env.frontendurl}`;

/**
 * @swagger
 * tags:
 *   - name: Payment Gateway
 *     description: Payment processing and webhook endpoints
 *   - name: System
 *     description: System health and utility endpoints
 */

const orderCode = Math.floor(Math.random() * 10000);

/**
 * @swagger
 * /api/create-payment-link:
 *   post:
 *     tags: [Payment Gateway]
 *     summary: Create payment link
 *     description: Creates a payment link using PayOS for course enrollment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentLink'
 *           example:
 *             amount: 9999
 *             description: "Course enrollment payment"
 *     responses:
 *       200:
 *         description: Payment link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentLinkResponse'
 *       400:
 *         description: Missing required parameters
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Amount and description are required"
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Internal Server Error"
 */
app.post('/api/create-payment-link', async (req, res) => {
  // Nhận các tham số từ request body
  const { amount, description } = req.body;

  if (!amount || !description) {
    return res.status(400).send('Amount and description are required');
  }

  // Tạo orderCode mới mỗi lần request
  const orderCode = Math.floor(Math.random() * 10000);

  const order = {
    amount: amount, // Sử dụng giá trị amount từ request body
    description: description, // Sử dụng giá trị description từ request body
    orderCode: orderCode,

    returnUrl: `${CLIENT_DOMAIN}/success`,
    cancelUrl: `${CLIENT_DOMAIN}/cancel`,
  };

  try {
    const paymentLink = await payos.createPaymentLink(order);
    res.json({ checkoutUrl: paymentLink.checkoutUrl, orderCode: orderCode });
  } catch (error) {
    console.error('Error creating payment link:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * @swagger
 * /:
 *   get:
 *     tags: [System]
 *     summary: Health check
 *     description: Simple health check endpoint to verify server is running
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Server is running"
 */
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'E-Learning Platform API Documentation',
  }),
);

app.use('/uploads', express.static('uploads'));
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);

/**
 * @swagger
 * /receive-hook:
 *   post:
 *     tags: [Payment Gateway]
 *     summary: Payment webhook
 *     description: Webhook endpoint to receive payment notifications from payment gateway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Payment webhook payload
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Echo of the received payload
 */
app.post('/receive-hook', async (req, res) => {
  console.log(req.body);
  res.status(200).json(req.body);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
  connectDb();
});
