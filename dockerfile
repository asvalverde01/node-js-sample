# Usamos una imagen oficial de Node.js como base
FROM node:14-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .

# Puerto en el que corre la app (Heroku sample usa 5000)
EXPOSE 5000

# Comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
