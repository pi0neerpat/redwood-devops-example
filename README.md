# About

No project is complete without a proper release. The example here is for a RedwoodJS project using Docker images for deployment, but you can replace the resulting action with anything (eg. trigger an external service, build something in /packages, etc.).

# Usage

1. Merge to `staging` or `main`. This will create a new release draft for you to complete.
2. Publish the draft release to trigger a new build
3. When finished you'll get a Discord notification

# Set up

Update your Secrets for Actions to include:

- `DISCORD_WEBHOOK_DEVOPS` - Copy from your Discord channel settings.

# Features wanted

- Add the release details to a Changelog file. See https://keepachangelog.com

# TODO

- [ ] Don't tag `latest` if release candidate
