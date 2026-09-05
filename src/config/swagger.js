const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Spej Odejda API",
      version: "1.0.0",
      description: "Authentication and Users API documentation",
    },
    servers: [
      {
        url: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`,
      },
      {
        url: process.env.BACKEND_PUBLIC_URL || "https://black-phoenix-backend.onrender.com",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  console.log(`Swagger running -> ${(process.env.BACKEND_PUBLIC_URL || "https://black-phoenix-backend.onrender.com")}/api-docs`);
};

module.exports = swaggerDocs;
