# AdoptMe API – Entrega Nº1 (Mocks)

Este repositorio contiene una base de API **Express + Mongoose** preparada para la **Entrega Nº1** de Backend III.
La entrega agrega un **router de mocks** para generar datos falsos (usuarios y mascotas) y, opcionalmente, **sembrarlos** en una base de datos real (MongoDB Atlas o Mongo local).

---

## ✨ ¿Qué incluye esta entrega?

- Router `mocks.router.js` montado en **`/api/mocks`**.
- **Mocking en memoria** (no requiere DB):

  - `GET /api/mocks/mockingpets`
  - `GET /api/mocks/mockingusers`

- **Seeding a la base de datos** (requiere DB):

  - `POST /api/mocks/generateData` { users, pets }

- **Módulo de Mocking** en `src/mocks/mocking.js`:

  - Genera usuarios con contraseña **"coder123" encriptada** (bcrypt), `role` aleatorio (`user`|`admin`) y `pets: []`.
  - Genera mascotas de ejemplo.

> **Importante:** Los endpoints de _mocking_ funcionan **siempre** (no requieren DB). Para _generar e insertar_ en DB (seeding), debés tener una conexión válida a MongoDB (Atlas o local).

---

## 📦 Requisitos

- Node.js **≥ 18 LTS**
- npm
- (Para seeding) Base MongoDB accesible (Atlas o local)

---

## 🚀 Instalación y arranque

```bash
# En la raíz del proyecto
npm install

# Arrancar el servidor
npm start
# o
node src/app.js
```

Por defecto el servidor inicia en `http://localhost:8080/`.

---

## 🗄️ Configuración de Base de Datos

La app puede funcionar de tres maneras:

### Opción A — **Sin DB (solo mocks)**

No necesitás tocar nada: podés llamar `GET /api/mocks/mockingpets` y `GET /api/mocks/mockingusers` para recibir datos falsos en memoria.

### Opción B — **MongoDB Atlas**

1. Obtén el **connection string** (Connect → Drivers) y reemplazá el nombre de la base por uno de tu preferencia, por ejemplo `adoptme`.
2. En `src/app.js`, reemplazá la URI de ejemplo por tu cadena de Atlas (temporalmente para probar). Ejemplo de forma:

   ```
   mongodb+srv://<USER>:<PASS>@cluster0.xxx.mongodb.net/adoptme?retryWrites=true&w=majority&appName=Cluster0
   ```

3. Reiniciá el server.

### Opción C — **MongoDB local**
