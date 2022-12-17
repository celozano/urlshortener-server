FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
ENV NODE_ENV=production
RUN npm prune --production

FROM node:18-alpine AS main
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist/ dist/
COPY --from=builder /app/node_modules/ node_modules/
CMD ["node", "dist/index.js"]