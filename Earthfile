VERSION 0.6
FROM node:16
WORKDIR /app

deps:
    COPY package.json ./
    COPY yarn.lock ./
    RUN yarn
    # Output these back in case npm install changes them.
    SAVE ARTIFACT package.json AS LOCAL ./package.json
    SAVE ARTIFACT yarn.lock AS LOCAL ./yarn.lock

build:
    FROM +deps
    COPY src src
    RUN mkdir -p ./dist && cp ./src/index.html ./dist/
    RUN npx webpack
    SAVE ARTIFACT dist /dist AS LOCAL dist

docker:
    FROM +deps
    ARG tag='latest'
    COPY +build/dist ./dist
    EXPOSE 8080
    ENTRYPOINT ["/js-example/node_modules/http-server/bin/http-server", "./dist"]
    SAVE IMAGE js-example:$tag

migrate:
    # Only runs if entire run succeeds. Run with `earthly --push +migrate`
    # TODO: migrate dev database
    RUN --push ./migrate.sh

# TODO: Check that api image starts properly
# Run your app and api side by side
#with-docker-example:
#    FROM earthly/dind:alpine
#    RUN apk add curl
#    WITH DOCKER \
#        --load app:latest=+app-docker \
#        --load api:latest=+api-docker
#        RUN docker run -d -p 3080:3080 api && \
#            docker run -d -p 8080:8080 app  && \
#            sleep 5 && \
#            curl 0.0.0.0:8080 | grep 'Getting Started' && \
#            curl 0.0.0.0:3080/api/users | grep 'Earth'
#    END
