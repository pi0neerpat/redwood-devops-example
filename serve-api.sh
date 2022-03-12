#!/bin/bash -ve
yarn rw prisma migrate deploy
yarn rw serve api
