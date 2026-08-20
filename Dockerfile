FROM node:20-alpine

# Installer git pour cloner si besoin
RUN apk add --no-cache git

WORKDIR /app

# Copier package.json d'abord pour cache npm
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier tout le reste du code
COPY . .

# Port pour Render
EXPOSE 3000

# Lancer le bot
CMD ["npm", "start"]
