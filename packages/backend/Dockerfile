FROM node:22.13.1-alpine3.20 AS builder

RUN npm install -g pnpm@9.11.0

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend/package.json packages/backend/tsconfig.json packages/backend/.sequelizerc ./packages/backend/

RUN pnpm install --frozen-lockfile

COPY . .

WORKDIR /usr/app/packages/backend
RUN pnpm run build

FROM node:22.13.1-alpine3.20

WORKDIR /usr/app

COPY --from=builder /usr/app/package.json /usr/app/pnpm-lock.yaml /usr/app/pnpm-workspace.yaml ./
COPY --from=builder /usr/app/packages/backend/package.json /usr/app/packages/backend/tsconfig.json /usr/app/packages/backend/.sequelizerc ./packages/backend/

RUN npm install -g pnpm@9.11.0 && \
    pnpm install --frozen-lockfile

COPY --from=builder /usr/app/packages/backend/dist ./packages/backend/dist

WORKDIR /usr/app/packages/backend

# Run migrations and start the server
CMD sh -c 'npx sequelize-cli db:migrate && echo "Migration completed" && node dist/index.js'

# TODO: Copy only the necessary files and directories