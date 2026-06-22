FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package files first to cache dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files from the server directory
COPY . .

# Explicitly use node to start the index.js file
CMD ["node", "index.js"]