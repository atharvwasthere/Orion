# syntax=docker/dockerfile:1

# --- STAGE 1: build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install ALL deps (including dev)
RUN npm ci

# Copy all source
COPY . .

# Build the TypeScript app
RUN npx prisma generate
RUN npm run build

# --- STAGE 2: production runtime ---
FROM node:20-alpine AS prod
WORKDIR /app

# Copy only dependency files and install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output and Prisma artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
CMD ["npm", "start"]
