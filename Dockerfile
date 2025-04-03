# Menggunakan image resmi Node.js sebagai base image
FROM node:18-alpine AS build

# Set working directory dalam container
WORKDIR /app

# Copy package.json dan package-lock.json ke dalam container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy semua file ke dalam container setelah npm install selesai
COPY . .

# Set ARG untuk build-time environment variables
ARG REACT_APP_API_LOCAL
ENV REACT_APP_API_LOCAL=$REACT_APP_API_LOCAL

# Build aplikasi dengan environment variable
RUN npm run build

# Gunakan image nginx untuk menjalankan aplikasi
FROM nginx:alpine

# Copy file build React ke dalam direktori default nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Perintah untuk menjalankan nginx
CMD ["nginx", "-g", "daemon off;"]
