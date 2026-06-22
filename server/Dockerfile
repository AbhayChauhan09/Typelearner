FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .

# Expose the port
EXPOSE 3000


CMD ["node", "server/index.js"]