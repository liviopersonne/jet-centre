FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN apt update -y && apt install -y openssl

RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE 5005
