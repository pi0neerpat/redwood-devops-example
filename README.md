# About

No project is complete without a proper release. The example here is for a RedwoodJS project using Docker images for deployment, but you can replace the resulting action with anything (eg. trigger an external service, build something in /packages, etc.).

# Usage

1. Merge to `staging` or `main`. This will create a new release draft for you to complete.
2. Publish the draft release, which triggers a new Docker publish
3. When finished you'll get a Discord notification

You can also manually trigger deployments using the workflow dispatch trigger.

# Set up

Add to your existing Redwood project:

1. Update your repo's secrets with `DISCORD_WEBHOOK_DEVOPS` from your Discord channel settings.
2. `yarn add lerna -W -D && yarn lerna init`
3. Use the template `publish-ghcr.yml` to create your own deployment action.

If you plan on using the Docker image builds, copy over `/web/Dockerfile`, `/api/Dockerfile`, and `/web/config/nginx/default.conf`

# TODO

- [ ] Don't tag `latest` if release candidate
