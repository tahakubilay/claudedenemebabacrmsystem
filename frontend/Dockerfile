# frontend/Dockerfile

# 1. Base Image
FROM node:18-alpine AS base

# 2. 'deps' (Bağımlılık) Aşaması
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./

# Çakışan paketleri temizle
RUN npm uninstall @nextui-org/react @nextui-org/theme

# Bağımlılıkları yükle
RUN npm install

# Cache'i temizle ve lock dosyasını düzelt
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# 3. 'builder' (Derleme) Aşaması
FROM base AS builder
WORKDIR /app

# TEMİZ node_modules'u kopyala
COPY --from=deps /app/node_modules ./node_modules

# Kaynak kodları kopyala
COPY . .

# Builder katmanında da çakışan paketleri temizle
RUN npm uninstall @nextui-org/react @nextui-org/theme

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build
RUN npm run build

# 4. 'runner' (Çalıştırma) Aşaması
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]