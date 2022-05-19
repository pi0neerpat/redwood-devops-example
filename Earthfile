VERSION 0.6
FROM node:16
WORKDIR /app

deps:
    COPY package.json .
    COPY yarn.lock .
    COPY api api
    COPY web web
    COPY packages packages
    # needed for package's deps as well
    COPY lerna.json .
    COPY redwood.toml .
    COPY graphql.config.js .
    COPY .nvmrc .
    RUN yarn && yarn cache clean
    # Output these back in case yarn install changes them.
    SAVE ARTIFACT package.json AS LOCAL ./package.json
    SAVE ARTIFACT yarn.lock AS LOCAL ./yarn.lock

build-packages:
    FROM +deps
    RUN yarn build-packages
    SAVE ARTIFACT packages packages

test:
    FROM +deps
    RUN yarn rw lint
    RUN yarn rw check
    # TODO: Get tests throughout the app to a passing state
    # WITH DOCKER \
    #     --pull postgres:14-alpine
    #   RUN docker run -d -e POSTGRES_PASSWORD=test -p 5432:5432 postgres:14-alpine && \
    #       TEST_DATABASE_URL=postgres://postgres:test@localhost:5432/treasurechesstest?connection_limit=1 \
    #       yarn rw test --ci --no-watch
    # END

build-app:
    FROM +deps
    COPY +build-packages/packages packages
    # TODO: figure out arguments
    ARG ENVIRONMENT='local'
    ARG VERSION='latest'
    RUN yarn rw build
    # Optional "AS LOCAL" for testing outputs locally with "rw serve"
    SAVE ARTIFACT web/dist web/dist # AS LOCAL ./web/dist
    SAVE ARTIFACT api/dist api/dist # AS LOCAL ./api/dist
    SAVE ARTIFACT api/db api/db

docker-web:
    FROM nginx
    BUILD +build-app # Ensures /dist always saved locally for 'rw serve' purposes
    ARG ENVIRONMENT='local'
    ARG VERSION='latest'
    COPY web/config/nginx/default.conf /etc/nginx/conf.d/default.conf
    COPY +build-app/web/dist /usr/share/nginx/html
    RUN ls -lA /usr/share/nginx/html
    EXPOSE 8910
    SAVE IMAGE --push ghcr.io/pi0neerpat/redwood-devops-example-web:$VERSION

docker-api:
    FROM +deps
    BUILD +build-app
    ARG VERSION='latest'
    ENV ENVIRONMENT='local'
    COPY +build-app/api/dist /api/dist
    COPY +build-app/api/db /api/db
    COPY serve-api.sh .
    COPY redwood.toml .
    COPY graphql.config.js .
    RUN yarn global add @redwoodjs/api-server @redwoodjs/internal prisma && \
      apt-get update && apt install -y nano ncdu
    EXPOSE 8911
    ENTRYPOINT ["./serve-api.sh"]
    SAVE IMAGE --push ghcr.io/pi0neerpat/redwood-devops-example-api:$VERSION

docker:
  BUILD +docker-web
  BUILD +docker-api

test-images:
    FROM earthly/dind:alpine
    ARG VERSION='latest'
    RUN apk add curl
    WITH DOCKER \
        --load ghcr.io/pi0neerpat/redwood-devops-example-web:$VERSION=+docker-web \
        --load ghcr.io/pi0neerpat/redwood-devops-example-api:$VERSION=+docker-api
        RUN docker run -d -p 8910:8910 ghcr.io/pi0neerpat/redwood-devops-example-web && \
            sleep 5 && \
            curl 0.0.0.0:8910 | grep 'Treasure Chess'
    END

migrate:
# Only runs if entire run succeeds. Run with `earthly --push +migrate`
# TODO: migrate dev database
    FROM +build-app
    RUN --push ./migrate.sh
