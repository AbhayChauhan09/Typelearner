FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json from the server folder
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy everything from the server folder to /app
COPY  . .

# Expose the port
EXPOSE 3000

# Run index.js from the current directory (now that we copied the contents of server/)
CMD ["node", "index.js"]