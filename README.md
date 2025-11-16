# 🐾 AdoptMe API – Entrega Final Backend III

API REST construida con **Node.js + Express + Mongoose** para gestionar:

- Usuarios
- Mascotas
- Adopciones
- Sesiones (login con JWT)
- Mocks de datos (usuarios y mascotas de prueba)

Esta versión incluye:

- 📘 **Documentación con Swagger** (módulo `Users` y endpoint de mocks `generateData`)
- 🧪 **Tests funcionales** para todos los endpoints de `adoption.router.js` (Mocha + Supertest)
- 🐳 **Dockerfile** para dockerizar el proyecto
- 🐙 Imagen publicada en Docker Hub (link más abajo)
- 🧾 Manejo de logs con **Winston**
- ⚠️ Middleware global de manejo de errores

---

## 📂 Estructura general del proyecto

```txt
/ (raíz)
  Dockerfile
  package.json
  README.md
  .env.example
  /src
    app.js
    /routes
      users.router.js
      pets.router.js
      adoption.router.js
      sessions.router.js
      mocks.router.js
    /controllers
      users.controller.js
      pets.controller.js
      adoptions.controller.js
      sessions.controller.js
      mocks.controller.js
    /dao
    /repository
    /docs
      users.yaml
      (config swagger.js)
    /config
      logger.js
    /middlewares
      errorHandler.js
    /mocks
      mocking.js
    /utils
      index.js (hash, __dirname)

⚙️ Tecnologías usadas

Node.js + Express

MongoDB + Mongoose

Swagger (swagger-jsdoc + swagger-ui-express)

Mocha + Supertest (tests de integración/funcionales)

Winston (logger)

Docker


🔑 Variables de entorno

El proyecto usa variables de entorno.
En la raíz del repo hay un archivo .env.example.

📄 Crear tu .env

cp .env.example .env


🧩 Editar el valor de MONGO_URL según tu entorno

Mongo local (ejemplo):

MONGO_URL=mongodb://localhost:27017/db_example?directConnection=true


Mongo Atlas (ejemplo genérico):

MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

```

Asegurate de tener:

PORT=8080
MODE=DEV # o PROD

⚠️ El archivo .env no se sube al repositorio.
Solo se sube .env.example.

🚀 Ejecución local (sin Docker)
1️⃣ Instalar dependencias
npm install

2️⃣ Asegurarse de tener .env configurado
3️⃣ Ejecutar en modo desarrollo
npm run dev

La API quedará disponible en:

API base → http://localhost:8080

Swagger UI → http://localhost:8080/api-docs

📘 Documentación Swagger

La documentación se monta en:

http://localhost:8080/api-docs

Rutas documentadas:

GET /api/users → listado de usuarios

GET /api/users/{uid} → obtener usuario por ID

PUT /api/users/{uid} → actualizar usuario

DELETE /api/users/{uid} → eliminar usuario

POST /api/mocks/generateData → (solo en modo DEV) generar usuarios y mascotas de prueba en la base de datos

Nota: El endpoint POST /api/mocks/generateData se expone únicamente cuando MODE=DEV.

🧪 Tests funcionales (adoption.router.js)

Los tests funcionales están escritos con Mocha + Supertest y cubren todos los endpoints del router:

GET /api/adoptions/

GET /api/adoptions/:aid

POST /api/adoptions/:uid/:pid

🧾 Para ejecutarlos:
npm test

Casos de prueba incluidos:

✅ Creación de adopción válida
⚠️ Usuario inexistente
⚠️ Mascota inexistente
⚠️ Mascota ya adoptada
⚠️ Adopción no encontrada

🧪 Mocks de datos

Ruta base de mocks: /api/mocks
(Disponible solo cuando MODE=DEV)

Endpoints:

GET /api/mocks/mockingpets → Genera mascotas mock en memoria.

GET /api/mocks/mockingusers → Genera usuarios mock en memoria (contraseña "coder123" encriptada).

POST /api/mocks/generateData → Inserta en la DB usuarios y mascotas de prueba:

{
"users": 10,
"pets": 20
}

🐳 Docker
1️⃣ Construir la imagen
docker build -t adoptme-backend .

2️⃣ Ejecutar el contenedor usando .env
docker run -p 8080:8080 \
 --name adoptme-backend-contenedor \
 --env-file .env \
 adoptme-backend

El servidor quedará escuchando en:

http://localhost:8080

http://localhost:8080/api-docs

💡 También podés pasar las variables manualmente:

docker run -p 8080:8080 \
 --name adoptme-backend-contenedor \
 -e PORT=8080 \
 -e MODE=DEV \
 -e MONGO_URL="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority" \
 adoptme-backend

🐙 Imagen en Docker Hub

La imagen publicada se encuentra en:

https://hub.docker.com/r/joaquin021/adoptme-backend

Para usarla:

docker pull joaquin021/adoptme-backend:latest

docker run -p 8080:8080 \
 -e PORT=8080 \
 -e MODE=DEV \
 -e MONGO_URL="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority" \
joaquin021/adoptme-backend

👆 El profesor puede usar su propia MONGO_URL, no necesita acceso a tu cluster.

🧾 Logs y manejo de errores

Los logs se manejan con Winston (src/config/logger.js).

Niveles: fatal, error, warning, info, http, debug.

En MODE=DEV: logs coloridos en consola.

En MODE=PROD: también se guardan en ./logs/errors.log.

El proyecto implementa un middleware global de manejo de errores (src/middlewares/errorHandler.js) que devuelve errores en formato JSON estándar.

✅ Resumen

✔️ Documentación Swagger (Users + generateData)
✔️ Tests funcionales (adoption.router.js)
✔️ Dockerfile + Imagen DockerHub
✔️ Logs con Winston
✔️ Middleware de errores
✔️ Variables de entorno
✔️ Mocks activos en modo DEV
