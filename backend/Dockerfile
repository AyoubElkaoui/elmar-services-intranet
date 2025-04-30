# Development Dockerfile voor Strapi
FROM node:20-alpine

WORKDIR /app

# Kopieer package.json en package-lock.json
COPY package.json package-lock.json* ./

# Installeer dependencies
RUN npm ci

# Kopieer de rest van de applicatie
COPY . .

# Expose de poort waar Strapi op draait
EXPOSE 1337

# Start de development server
CMD ["npm", "run", "develop"]
