import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";
import { swaggerUi, swaggerSpecs } from "./docs/swagger.js";

import logger from "./config/logger.js"; // ✅ Winston
import errorHandler from "./middlewares/errorHandler.js"; // ✅ Manejo global de errores

// Cargar variables de entorno
dotenv.config();

// Inicializar app
const app = express();

// Variables desde .env
const PORT = process.env.PORT || 8080;
const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb://localhost:27017/db_example?directConnection=true";
const MODE = process.env.MODE || "DEV";

// Conexión a Mongo
mongoose
  .connect(MONGO_URL)
  .then(() => logger.info("✅ MongoDB conectado correctamente"))
  .catch((err) =>
    logger.error("❌ Error al conectar con MongoDB: " + err.message)
  );

// Middleware global de parseo
app.use(express.json());
app.use(cookieParser());

// ✅ Middleware de logs HTTP: registra cada request entrante
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// Swagger (documentación)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rutas principales
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);

// ✅ Rutas de desarrollo (solo si MODE === DEV)
if (MODE === "DEV") {
  app.use("/api/mocks", mocksRouter);
  logger.info("🧪 Rutas de mocks habilitadas (modo DEV)");
}

// Página base
app.get("/", (req, res) => {
  const style = `
    <style>
      body { font-family: Arial, sans-serif; text-align: center; }
      h1 { color: #333; }
      p { color: #555; }
    </style>
  `;
  const content = `
    <h1>Welcome to the AdoptMe API</h1>
    <p>Use the endpoints to manage users, pets, adoptions, and sessions.</p>
    <p><a href="/api-docs">📘 View API Documentation (Swagger)</a></p>
  `;
  res.send(`${style}${content}`);
});

// ✅ Middleware global de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(
    `🚀 Server running on port http://localhost:${PORT} (MODE=${MODE})`
  );
});

export default app;
