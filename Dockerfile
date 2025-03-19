# Use Node.js LTS as the base image
FROM node:18-bullseye

# Set the working directory
WORKDIR /app

# Copy package.json and lock files
COPY package.json package-lock.json ./

# Clean up node_modules and package-lock.json
RUN rm -rf node_modules package-lock.json

# Install dependencies with legacy peer deps flag to avoid compatibility issues
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5173

# Start the application in development mode
CMD ["npm", "run", "dev"]