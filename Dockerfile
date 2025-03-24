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
# Build with base-href set to / for Coolify
RUN npm run build:prod -- --base-href=/

# Runtime stage
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/student-management-angular/browser /usr/share/nginx/html

# Create a simple health check file
RUN echo "OK" > /usr/share/nginx/html/health

# Configure Nginx directly in the Dockerfile
RUN rm /etc/nginx/conf.d/default.conf
RUN echo 'server { \
    listen 80 default_server; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Enable gzip compression \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    gzip_proxied any; \
    gzip_comp_level 6; \
    gzip_min_length 256; \
    \
    # Health check endpoint \
    location = /health { \
        access_log off; \
        add_header Content-Type text/plain; \
    } \
    \
    # Enable caching for static assets \
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js)$ { \
        expires 1y; \
        add_header Cache-Control "public, max-age=31536000"; \
        try_files $uri =404; \
    } \
    \
    # Handle Angular routing \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check targeting port 80
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# When the container starts, nginx will serve the application
CMD ["nginx", "-g", "daemon off;"]
