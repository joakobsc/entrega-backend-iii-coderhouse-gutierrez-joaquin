
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de dependencias primero (aprovecha caché)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY ./src ./src

EXPOSE ${PORT}

# Comando por defecto
CMD ["npm", "start"]
