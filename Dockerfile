FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN apt-get update -y && apt install -y openssl debian-openssl

RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE 5005
