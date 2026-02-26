# -------------------------
# 1️⃣ Builder Stage
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Copy prisma schema BEFORE install (fix for postinstall)
COPY prisma ./prisma

# Install dependencies deterministically
RUN npm ci

# Copy remaining source code
COPY . .

# Build standalone Next.js output
RUN npm run build


# -------------------------
# 2️⃣ Production Stage
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone output
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static

# Copy public folder if exists
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]