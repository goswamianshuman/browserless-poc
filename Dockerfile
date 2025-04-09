# ---------- Development Stage ----------
FROM node:22 AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Optional: for hot reload (used with start:dev)
RUN npm install --save-dev @nestjs/cli
RUN npm run build

# ---------- Production Stage ----------
FROM node:22 AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=development /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/main"]
