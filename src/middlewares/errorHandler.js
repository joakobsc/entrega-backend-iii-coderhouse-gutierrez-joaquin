// src/middlewares/errorHandler.js
import logger from "../config/logger.js";

export default function errorHandler(err, req, res, next) {
  // Log del error
  logger.error(`❌ ${err.message}`);

  if (process.env.MODE === "DEV") {
    logger.debug(err.stack);
  }

  // Determinamos el código de estado (si no lo tiene, usamos 500)
  const status = err.statusCode || 500;

  // Enviamos una respuesta consistente
  res.status(status).json({
    status: "error",
    message:
      process.env.MODE === "DEV"
        ? err.message
        : "Ocurrió un error interno en el servidor",
  });
}
