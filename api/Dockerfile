FROM pi0neerpat/redwood-api-base as base

WORKDIR /app

COPY lerna.json .
COPY base.package.json package.json
# COPY api/package.json /app/api/package.json
COPY yarn.lock .
COPY packages .

COPY api/dist /app/api/dist
COPY node_modules/.prisma /app/node_modules/.prisma

COPY api/db /app/api/db
COPY redwood.toml .
COPY serve-api.sh .

RUN yarn --production

# Expose RedwoodJS api port
EXPOSE 8911

# Entrypoint to @redwoodjs/api-server binary
ENTRYPOINT ["./serve-api.sh"]
