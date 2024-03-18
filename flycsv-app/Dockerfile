# Use node image as base
FROM node:16 AS builder

# Set working directory
WORKDIR /app

# Install Angular CLI
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json
COPY flycsv-app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY flycsv-app .

# Build the Angular app
RUN npm run build --prod

# Use Nginx as the base image
FROM nginx:alpine

# Copy built Angular app to Nginx public directory
COPY --from=builder /app/dist/flycsv-app /usr/share/nginx/html

# Expose port 4200
EXPOSE 4200

# Run Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0"]

# # Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]