# ==
# Base
FROM node:14 as base

WORKDIR /app

ARG NODE_ENV
ARG RUNTIME_ENV

ENV NODE_ENV=$NODE_ENV
ENV RUNTIME_ENV=$RUNTIME_ENV

COPY package.json package.json
COPY yarn.lock yarn.lock

COPY redwood.toml redwood.toml
COPY graphql.config.js graphql.config.js

COPY packages packages
COPY api/package.json api/package.json
COPY web/package.json web/package.json
COPY lerna.json lerna.json

RUN yarn install --frozen-lockfile

# ==
# Build
FROM base as build

COPY api api
COPY packages packages

RUN yarn build-packages && yarn rw build api

# ==
# Serve
FROM node:14 as serve

WORKDIR /app

COPY serve-api.sh serve-api.sh

COPY --from=build /app/packages /app/packages

COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/api/dist /app/api/dist
COPY --from=build /app/api/db /app/api/db
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/api/package.json /app/api/package.json
COPY --from=build /app/yarn.lock /app/api/yarn.lock

COPY --from=build /app/redwood.toml /app/redwood.toml

RUN yarn --cwd "api" --frozen-lockfile install

# Expose RedwoodJS api port
EXPOSE 8911

# Entrypoint to @redwoodjs/api-server binary
ENTRYPOINT ["./serve-api.sh"]
