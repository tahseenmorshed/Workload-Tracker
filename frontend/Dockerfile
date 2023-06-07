FROM node:18.8.0-alpine as builder
ENV NODE_ENV=production

WORKDIR /app

# Copy package.json and install dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

# Copy the rest of the files
COPY . ./

# Build the app
RUN npm run build

# Create nginx instance
FROM nginx:1.23.1-alpine

# Copy the build files from the builder stage
RUN mkdir -p /var/www/html/workloadmanager
COPY --from=builder /app/build /var/www/html/workloadmanager

# Copy the nginx config
COPY nginx.conf /etc/nginx/nginx.conf


# Run docker
CMD ["nginx", "-g", "daemon off;"]
