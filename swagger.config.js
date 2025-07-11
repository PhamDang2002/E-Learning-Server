import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the swagger.json file
const swaggerJsonPath = path.join(__dirname, 'swagger.json');
let swaggerSpec;

try {
  const jsonContent = fs.readFileSync(swaggerJsonPath, 'utf8');
  swaggerSpec = JSON.parse(jsonContent);
} catch (error) {
  console.error('Error loading swagger.json:', error);
  // Fallback to a basic spec
  swaggerSpec = {
    openapi: '3.0.3',
    info: {
      title: 'E-Learning Server API',
      description: 'API documentation for the E-Learning platform',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    paths: {},
  };
}

// Swagger UI options
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 10px; border-radius: 5px; }
  `,
  customSiteTitle: 'E-Learning API Documentation',
  customfavIcon: '/favicon.ico',
};

export { swaggerSpec, swaggerUi, swaggerUiOptions };
