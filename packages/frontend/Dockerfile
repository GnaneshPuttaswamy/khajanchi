FROM node:22.13.1-alpine3.20 AS builder

RUN npm install -g pnpm@9.11.0

WORKDIR /usr/app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/frontend/package.json ./packages/frontend/

RUN pnpm install --frozen-lockfile

COPY . .

WORKDIR /usr/app/packages/frontend
RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /usr/app/packages/frontend/dist /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]