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

![image](https://user-images.githubusercontent.com/35622595/158308437-70ac8fd9-1986-48d9-afe3-65da3b3bd03e.png)

## Usage

1. Merge to `staging` or `main`. This will create a new release draft for you to complete.
2. Publish the draft release, which triggers a new Docker publish
3. When finished you'll get a Discord notification

You can also manually trigger deployments using the workflow dispatch trigger.

## Setup

Follow these steps to add this to an existing project:

1. Update your repo's secrets with `DISCORD_WEBHOOK_DEVOPS` from your Discord channel settings.
2. `yarn add lerna -W -D && yarn lerna init`
3. Copy `ci.yml` and `publish-ghcr.yml` to your repo, and update as needed.

If you plan building Docker image, as in the example here, you'll need to copy over `/web/Dockerfile`, `/api/Dockerfile`, and `/web/config/nginx/default.conf`.

NOTE: If you have branch protection on, you will need to use a Github Personal Access Token in order for lerna to push commits. See [here](https://github.com/lerna/lerna/issues/1957#issuecomment-997377227).

<details><summary>See changes for protected branches</summary>

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

## TODO

- Update test to use Github service container for test database https://docs.github.com/en/actions/using-containerized-services/creating-postgresql-service-containers

## Author

👤 **Patrick Gallagher**

- Website: https://patrickgallagher.dev
  - Twitter: [@pi0neerpat](https://twitter.com/pi0neerpat)
  - GitHub: [@pi0neerpat](https://github.com/pi0neerpat)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
