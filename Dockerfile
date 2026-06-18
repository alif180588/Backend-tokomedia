# Menggunakan base image Node.js versi 20 slim
FROM node:20-slim

# Install openssl yang dibutuhkan oleh Prisma
RUN apt-get update -y && apt-get install -y openssl
# Set working directory di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Menyalin folder prisma untuk proses generate client
COPY prisma ./prisma/

# Menginstall seluruh dependencies (termasuk devDependencies yang dibutuhkan untuk build)
RUN npm install

# Men-generate Prisma client agar sesuai dengan arsitektur Linux Alpine
RUN npx prisma generate

# Menyalin seluruh source code ke dalam container
COPY . .

# Melakukan build TypeScript menjadi JavaScript (ke folder dist)
RUN npm run build

# Mengekspose port 3000 (sesuai pengaturan default, Railway bisa mengoverride ini)
EXPOSE 3000

# Menjalankan aplikasi
CMD ["npm", "start"]
