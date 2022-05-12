VERSION 0.6
FROM node:16
WORKDIR /app

deps:
    COPY package.json .
    COPY yarn.lock .
    COPY api/package.json api/package.json
    COPY web/package.json web/package.json
    COPY packages packages
    # needed for package's deps as well
    COPY lerna.json .
    COPY redwood.toml .
    COPY graphql.config.js .
    COPY .nvmrc .
    RUN yarn
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
    RUN yarn rw test
    RUN yarn rw check

build-app:
    FROM +deps
    COPY +build-packages/packages packages
    # TODO: figure out arguments
    ARG ENVIRONMENT='staging'
    ARG VERSION='latest'
    COPY api api
    COPY web web
    RUN yarn rw build web
    SAVE ARTIFACT web/dist web/dist AS LOCAL ./web/dist
    SAVE ARTIFACT api/dist api/dist AS LOCAL ./api/dist
    SAVE ARTIFACT api/db api/db

docker-web:
    FROM nginx
    BUILD +build-app # Ensures /dist always saved locally for 'rw serve' purposes
    ARG ENVIRONMENT='staging'
    ARG VERSION='latest'
    COPY web/config/nginx/default.conf /etc/nginx/conf.d/default.conf
    COPY +build-app/web/dist /usr/share/nginx/html
    RUN ls -lA /usr/share/nginx/html
    EXPOSE 8910
    SAVE IMAGE --push pi0neerpat/redwood-devops-example-web:$VERSION

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
    SAVE IMAGE --push pi0neerpat/redwood-devops-example-api:$VERSION

test-images:
    FROM earthly/dind:alpine
    RUN apk add curl
    WITH DOCKER \
        --load pi0neerpat/redwood-devops-example-web:latest=+docker-web \
        --load pi0neerpat/redwood-devops-example-api:latest=+docker-api
        RUN docker run -d -p 8910:8910 pi0neerpat/redwood-devops-example-web && \
            sleep 5 && \
            curl 0.0.0.0:8910 | grep 'Treasure Chess'
    END

migrate:
# Only runs if entire run succeeds. Run with `earthly --push +migrate`
# TODO: migrate dev database
    FROM +build-app
    RUN --push ./migrate.sh
