# Use the official Node.js image as the base image
FROM node:16 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install Angular CLI
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build --prod
# RUN ng build --configuration production

# Use a lightweight image for serving the Angular app
FROM nginx:alpine

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular app to the NGINX server directory
COPY --from=builder /app/dist/flycsv-app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]




# # Use node image as base
# FROM node:16 AS builder

# # Set working directory
# WORKDIR /app

# # Install Angular CLI
# RUN npm install -g @angular/cli

# # Copy package.json and package-lock.json
# COPY ./package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application
# COPY . .

# # Build the Angular app
# RUN npm run build --prod

# # Use Nginx as the base image
# FROM nginx:alpine

# # Copy built Angular app to Nginx public directory
# COPY --from=builder /app/dist/flycsv-app /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Run Angular development server
# #CMD ["ng", "serve", "--host", "0.0.0.0"]
# # CMD  ["ls /bin"]
# # # Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]