FROM node:20-slim

# Install openssl yang dibutuhkan oleh Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install semua dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client (dengan dummy URL agar build tidak gagal)
RUN DATABASE_URL="mysql://dummy:dummy@dummy:3306/dummy" npx prisma generate

# Copy seluruh source code
COPY . .

# Build TypeScript
RUN npm run build

# Buat folder uploads
RUN mkdir -p uploads/products

EXPOSE 3000

# Jalankan migrasi lalu start server
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/index.js"]
