<h1 align="center"><img width="600" style="border-radius: 12px 0px 0px 12px;" src="https://user-images.githubusercontent.com/35622595/161645096-1c45d1f2-c9ab-4314-86d6-7f31a8b6f771.png"/></h1>

<p align="center">
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/pi0neerpat" target="_blank">
    <img alt="Twitter: pi0neerpat" src="https://img.shields.io/twitter/follow/pi0neerpat.svg?style=social" />
  </a>
  <a href="https://twitter.com/treasurechess_" target="_blank">
    <img alt="Twitter: treasurechess_" src="https://img.shields.io/twitter/follow/treasurechess_.svg?style=social" />
  </a>
</p>

### Much of the code & tooling for Treasure Chess has been generalized for any RedwoodJS project, and made into open sauce so everyone can build a **production** Redwood app. We hope you find these resources useful. Happy hacking!

Note that not everything here will be relevant if you are just starting a redwood project, however You'll need it as you grow. P.S. We're hiring: https://github.com/treasure-chess/jobs

### Our Redwood Stack

🧑‍💻 Get a quick overview from our Redwood v1 launch presentation demo [source](https://github.com/pi0neerpat/treasurechess-redwood-presentation).

[![Redwood v1 launch presentation demo](https://img.youtube.com/vi/B0CP0aAePsI/0.jpg)](http://www.youtube.com/watch?v=B0CP0aAePsI)

The Redwood Framework is a solid foundation that works all the way to production. Almost every core component we use is "out-of-the-box", or slightly modified.

|                   | Tooling                                    |
| :---------------- | :----------------------------------------- |
| Web styling       | TailwindCSS, node-sass-glob-importer, etc. |
| Prerender         | #                                          |
| Router            | #                                          |
| Graphql           | #                                          |
| Login             | "Extended" dBAuth                          |
| Devops/CI         | Github Actions                             |
| Preview deploy    | Vercel                                     |
| Production deploy | Docker GCP Kubernetes                      |

_"#" = default settings_

# Devops

Managing a team of developers can be difficult. Here's some of things we wouldn't have survived without. These are all supplemental to the existing Redwood flow. Maybe you can help adopt them into the framework!

- Releases and Versioning (see section below)
- Docker containers https://community.redwoodjs.com/t/containerize-redwood-sides-with-docker-compose/2706/2?u=pi0neerpat
- Encrypted environment variables (also includes CI Actions) https://community.redwoodjs.com/t/encyrpted-environment-variables/2691?u=pi0neerpat.

# Frontend

The list here is short, because redwood \*solved\* web development.

- State Store & React Context https://community.redwoodjs.com/t/react-context-in-redwoodjs/2572?u=pi0neerpat

# Other Tooling

Here are some powerful tools

- "Extended" dbAuth / OAuth https://community.redwoodjs.com/t/combining-dbauth-oauth2/2452?u=pi0neerpat
  - LIVE production example using `eth-auth`: https://github.com/pi0neerpat/swordy-bot-v2/
  - Attempt at using Passport.js, but it was rather cumbersome https://github.com/pi0neerpat/oauth-2-passport-redwood
- OAuth general-purpose code (released soon)
- Headless rendering (for screenshots + image generation)
  - LIVE Hackathon example https://github.com/pi0neerpat/dao-preview
  - Fork-able example https://github.com/pi0neerpat/headless-screenshot. See example here (refresh if times out): https://headless-screenshot.vercel.app/api?url=https://grubhub.com

# Releases and versioning

No project is complete without a proper release. The example here is for a RedwoodJS project using Docker images for deployment, but you can replace the resulting action with anything (eg. trigger an external service, build something in /packages, etc.).

![image](https://user-images.githubusercontent.com/35622595/158308437-70ac8fd9-1986-48d9-afe3-65da3b3bd03e.png)

## Usage

1. Merge to `staging` or `main`. This will create a new release draft for you to complete.
2. Publish the draft release, which triggers a new Docker publish
3. When finished you'll get a Discord notification

You can also manually trigger deployments using the workflow dispatch trigger.

## Setup

Follow these steps to add this to an existing project:

1. Update your repo's secrets with `DISCORD_WEBHOOK_DEVOPS` from your Discord channel settings.

2. Add lerna to your project.

```bash
yarn add lerna -W -D && yarn lerna init
```

3. Copy `ci.yml` and `publish-ghcr.yml` into your repo Github Actions. You'll need to make updates to these files, depending on your deployment strategy (see Docker below).

<details><summary>NOTE: If you have branch protection on, you will need to use a Github Personal Access Token to enable lerna to push commits. Expand for more instructions.</summary>

See [related comment](https://github.com/lerna/lerna/issues/1957#issuecomment-997377227).

In `ci.yml` you'll need to use a PAT. Also a check is added to skip creating a release when lerna commits the new version.

```yml
create-release-draft:
  name: Create Release Draft
  needs: runCI
  if: needs.runCI.outputs.SKIP_RELEASE == 0
  runs-on: ubuntu-20.04
  steps:
    - name: Checkout
      uses: actions/checkout@v2
      with:
        token: ${{ secrets.PAT_GITHUB }}
    - name: Use Node.js 12.x
      uses: actions/setup-node@v1
      with:
        node-version: 12.x
        registry-url: https://registry.npmjs.org/
    - name: Update version
      id: update_version
      env:
        GH_TOKEN: ${{ secrets.PAT_GITHUB }}
      run: |
```

</details>

## Docker

If your deployment strategy is Docker, as in the example here, you'll need to copy over some additional files.

```
/web/Dockerfile
/api/Dockerfile
/web/config/nginx/default.conf
.dockerignore
```

To build docker locally, use the following commands.

```
# web
docker build . -t pi0neerpat/redwood-devops-example-web -f web/Dockerfile \
--build-arg ENVIRONMENT=local \
--build-arg VERSION=v0.0.1-dev \
--build-arg REDWOOD_API_URL=http://0.0.0.0:8911 \
--build-arg APP_DOMAIN=http://0.0.0.0:8910

# api
docker build . -t pi0neerpat/redwood-devops-example-api -f api/Dockerfile --build-arg ENVIRONMENT=local

# Base layer
docker build . -t pi0neerpat/redwood-api-base
```

Explore an image using bash:

```bash
docker run --rm -it --entrypoint=/bin/bash <imageId>
```

## Notes on Docker

Here is some of the rationale behind my docker setup

- Migrations cannot be run during the build. They can only be run when the container started within the production environment
- node-alpine is missing `python` and `node-gyp`, which are required for packages such as `node-canvas`
- "At that point all you need is the api-server package". I don't think this is true, since I encountered missing deps for `@graphql/server`

## TODO

- Update test to use Github service container for test database https://docs.github.com/en/actions/using-containerized-services/creating-postgresql-service-containers

## Author

👤 **Patrick Gallagher**

- Website: https://patrickgallagher.dev
- Twitter: [@pi0neerpat](https://twitter.com/pi0neerpat)
- GitHub: [@pi0neerpat](https://github.com/pi0neerpat)

👤 **Treasure Chess Community <maintainers@niftychess.com>**

- Website: https://treasurechess.com
- Twitter: [@treasurechess\_](https://twitter.com/treasurechess_)
- GitHub: [@Treasure-Chess](https://github.com/Treasure-Chess)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
