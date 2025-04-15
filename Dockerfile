FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS deploy

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts/data/films.json ./scripts/data/films.json

COPY entrypoint.sh .

RUN chmod +x entrypoint.sh
RUN npm ci --only=production

CMD ["./entrypoint.sh"]