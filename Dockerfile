# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build:prod

# Runtime stage
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/student-management-angular/browser /usr/share/nginx/html

# Copy custom nginx config for Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# When the container starts, nginx will serve the application
CMD ["nginx", "-g", "daemon off;"]
