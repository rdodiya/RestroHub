# syntax=docker/dockerfile:1
# ---------- Stage 1: build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# --ignore-scripts: skips the git-hook `prepare` script (no .git inside the image)
RUN if [ -f package-lock.json ]; then npm ci --ignore-scripts; else npm install --ignore-scripts; fi

COPY . .
ARG VITE_API_BASE_URL=http://localhost:8181/restroly
ARG VITE_GOOGLE_CLIENT_ID=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN npm run build

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ > /dev/null || exit 1
