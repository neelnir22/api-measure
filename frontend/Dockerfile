# Stage 1: Build React (Vite) App using Node 20
FROM node:20-alpine AS builder

WORKDIR /app

# Build-time API URL configuration
ARG VITE_API_URL="http://localhost:8000"
ENV VITE_API_URL=$VITE_API_URL

# Copy package manifests first for efficient layer caching
COPY package*.json ./
RUN npm install

# Copy source code and configuration files
COPY . .

# Build production bundle into /app/dist
RUN npm run build

# Stage 2: Serve production bundle with Nginx Alpine
FROM nginx:alpine

# Remove default nginx html files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
