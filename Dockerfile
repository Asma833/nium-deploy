# Use Node.js Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all application files
COPY . .

COPY .env .env

# Build the application
RUN npm run build

# Install serve globally - lightweight server for static files
RUN npm install -g serve

# Expose port 3000 (serve's default port)
EXPOSE 3000

# Start serve
CMD ["serve", "-s", "dist", "-l", "3000"]
