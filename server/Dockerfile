FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Server folder se package files copy karein
COPY package*.json ./

# Dependencies install karein
RUN npm install

# Server folder ka baaki code copy karein
COPY . .

# Expose the port
EXPOSE 3000

# Ab `index.js` mil jayega kyunki hum `server` folder ke andar hi hain
CMD ["node", "index.js"]