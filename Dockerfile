# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ---------- Production Stage ----------
FROM node:20-alpine

WORKDIR /app

ENV TZ=Asia/Kolkata

RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/${TZ} /etc/localtime && \
    echo ${TZ} > /etc/timezone

# Install static file server
RUN npm install -g serve

# Copy build files
COPY --from=builder /app/dist ./dist

EXPOSE 5189

CMD ["serve", "-s", "dist", "-l", "5189"]