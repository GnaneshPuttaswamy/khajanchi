FROM node:22.13.1-alpine3.20

RUN npm install -g pnpm@9.11.0

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "run", "dev"]