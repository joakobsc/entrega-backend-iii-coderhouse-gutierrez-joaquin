// src/docs/swagger.js
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";

// Cargar variables de entorno desde .env
dotenv.config();

// Leemos PORT y MODE (con valores por defecto)
const PORT = process.env.PORT || 8080;
const MODE = process.env.MODE || "DEV";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AdoptMe API",
      version: "1.0.0",
      description: "Documentación de la API REST AdoptMe",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: MODE === "PROD" ? "Producción" : "Desarrollo",
      },
    ],
  },
  // Tus YAMLs
  apis: ["./src/docs/*.yaml"],
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerSpecs };
