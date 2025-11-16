FROM node:20-alpine

# Directorio dentro del contenedor
WORKDIR /app

# Copiamos solo las dependencias primero (mejor uso de caché)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos TODO el proyecto (respetando .dockerignore)
COPY . .

# Exponemos el puerto de la app
EXPOSE 8080

# Comando por defecto para levantar el servidor
CMD ["npm", "start"]
