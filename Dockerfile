# ---------- Base Stage ----------
FROM node:22 AS base

WORKDIR /app
COPY package*.json ./

# ---------- Development Stage ----------
FROM base AS development

RUN npm install
COPY . .

# Optional CLI for dev tools and hot reload
RUN npm install --save-dev @nestjs/cli

# Rebuild the app for dev
RUN npm run build

CMD ["npm", "run", "start:dev"]

# ---------- Production Stage ----------
FROM base AS production

RUN npm install --omit=dev
COPY . .
RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:prod"]
    