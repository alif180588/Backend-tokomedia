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

# Men-generate Prisma client agar sesuai dengan arsitektur Linux
RUN DATABASE_URL="mysql://dummy:dummy@dummy:3306/dummy" npx prisma generate

# Menyalin seluruh source code ke dalam container
COPY . .

# Melakukan build TypeScript menjadi JavaScript (ke folder dist)
RUN npm run build

# Membuat folder uploads agar gambar produk bisa disimpan
RUN mkdir -p uploads/products

# Mengekspose port 3000 (Railway bisa mengoverride via env PORT)
EXPOSE 3000

# Menjalankan prisma db push (buat/update tabel) lalu start aplikasi
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm start"]
