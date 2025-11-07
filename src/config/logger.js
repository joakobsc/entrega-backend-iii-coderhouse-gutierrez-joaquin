// src/config/logger.js
import winston from "winston";

// 🔹 Definimos niveles personalizados
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "cyan",
    debug: "grey",
  },
};

// Aplicamos los colores definidos
winston.addColors(customLevels.colors);

const MODE = process.env.MODE || "DEV";

// 🔹 Configuramos el logger base
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: MODE === "DEV" ? "debug" : "info", // en DEV: logs detallados
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ level, message, timestamp }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    // En todos los entornos mostramos por consola
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    }),
  ],
});

// 🔹 En modo PROD también guardamos logs de error en archivo
if (MODE === "PROD") {
  logger.add(
    new winston.transports.File({
      filename: "./logs/errors.log",
      level: "error",
    })
  );
}

export default logger;
