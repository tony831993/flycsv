# Use the official Node.js 14 image
FROM node:16

# Set the working directory
WORKDIR /app

# Install Angular CLI
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 4200

# Run Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0"]