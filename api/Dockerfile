# ==
# Base
FROM node:14 as base

WORKDIR /app

ARG ENVIRONMENT
ENV ENVIRONMENT=$ENVIRONMENT

COPY package.json .
COPY api/package.json api/package.json
COPY web/package.json web/package.json
COPY lerna.json .
COPY yarn.lock .

COPY packages packages
COPY redwood.toml .
COPY graphql.config.js .


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

COPY --from=build /app/lerna.json .
COPY --from=build /app/package.json .
COPY --from=build /app/api/package.json /app/api/package.json
COPY --from=build /app/yarn.lock /app/yarn.lock
COPY --from=build /app/packages /app/packages

# Only install necessary dependencies.
# Uses Lerna for linking local packages, and Prisma for migrations
RUN yarn global add @redwoodjs/api-server @redwoodjs/internal lerna && \
      yarn install --production --frozen-lockfile

COPY --from=build /app/api/dist /app/api/dist
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma

COPY api/db /app/api/db
COPY redwood.toml .
COPY serve-api.sh .

# Helpful utilities for exploring your container
RUN ["apt-get", "update"]
RUN ["apt", "install", "-y", "nano", "ncdu"]

# Expose RedwoodJS api port
EXPOSE 8911

# Entrypoint to @redwoodjs/api-server binary
ENTRYPOINT ["./serve-api.sh"]
