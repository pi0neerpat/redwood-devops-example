<h1 align="center">Welcome to redwood-release-devops-example 👋</h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/pi0neerpat" target="_blank">
    <img alt="Twitter: pi0neerpat" src="https://img.shields.io/twitter/follow/pi0neerpat.svg?style=social" />
  </a>
</p>

> Github Action for making RedwoodJS releases

No project is complete without a proper release. The example here is for a RedwoodJS project using Docker images for deployment, but you can replace the resulting action with anything (eg. trigger an external service, build something in /packages, etc.).

## Usage

1. Merge to `staging` or `main`. This will create a new release draft for you to complete.
2. Publish the draft release, which triggers a new Docker publish
3. When finished you'll get a Discord notification

You can also manually trigger deployments using the workflow dispatch trigger.

## Setup

Add to your existing Redwood project:

1. Update your repo's secrets with `DISCORD_WEBHOOK_DEVOPS` from your Discord channel settings.
2. `yarn add lerna -W -D && yarn lerna init`
3. Use the template `publish-ghcr.yml` to create your own deployment action.

If you plan on using the Docker image builds, copy over `/web/Dockerfile`, `/api/Dockerfile`, and `/web/config/nginx/default.conf`

## Author

👤 **Patrick Gallagher**

- Website: https://patrickgallagher.dev
  - Twitter: [@pi0neerpat](https://twitter.com/pi0neerpat)
  - GitHub: [@pi0neerpat](https://github.com/pi0neerpat)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
