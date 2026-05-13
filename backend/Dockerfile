FROM node:20

# Creamos la carpeta de la app
WORKDIR /app

# Copiamos los archivos de dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Construimos el panel de administración de Strapi
RUN npm run build

# Exponemos el puerto de Strapi
EXPOSE 1337

# Comando para arrancar
CMD ["npm", "run", "start"]