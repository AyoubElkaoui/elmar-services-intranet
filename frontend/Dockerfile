
# Development Dockerfile voor Next.js
FROM node:20-alpine AS base

WORKDIR /app

# Kopieer package.json en package-lock.json
COPY package.json package-lock.json* ./

# Installeer dependencies
RUN npm ci

# Kopieer de rest van de applicatie
COPY . .

# Expose de poort waar de app op draait
EXPOSE 3000

# Start de development server
CMD ["npm", "run", "dev"]
