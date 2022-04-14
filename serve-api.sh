#!/bin/bash -ve
prisma migrate deploy --schema ./api/db/schema.prisma
rw-server api
