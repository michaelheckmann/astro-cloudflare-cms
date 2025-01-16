<img width="1398" alt="image" src="https://github.com/user-attachments/assets/a3b8ad95-5644-4194-892f-9a80257f7b35">

# Astro Cloudflare CMS

This is a boilerplate for setting up a simple CMS together with an Astro site.

## Features

- **PNPM Workspace**: PNPM workspaces for dependency management
- **Biome**: [Biome](https://biomejs.dev/) for linting and formatting
- **Simple CMS**: Inspired by [Pages CMS](https://pagescms.org/)
- **Typesafe Schema**: Typesafe schema for the CMS by using Zod
- **Astro Blog**: A simple blog setup with Astro consuming the CMS data
- **Cloudflare Pages**: Cloudflare Pages for deployment
- **Local Support**: Run the CMS locally and modify the files on your machine
- **Github as a Database**: Use Github as a database for the CMS

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: Run `pnpm install`
3. **Set the environment variables**: Create a personal access token on Github and set it in `cms/.dev.vars`
3. **Configure the CMS**: Update the `cms/src/config.ts` file with the structure you want
4. **Run the CMS**: Run `cd cms && pnpm dev:local`
5. **Run the Astro site**: Run `cd web && pnpm dev`

## Environment Variables

Learn more about the process of creating a personal access token on Github [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens). Make sure the token has read and write access to the repository you have specified in the `cms/src/config.ts` file.

## Configuration

The CMS is configured in the `cms/src/config.ts` file. Explore the config schema in `cms/src/lib/schema.ts`.

## Deployment

> [!IMPORTANT]  
> There is no built-in authentication in the CMS. Make sure to secure the CMS via Cloudflare Access or similar.

Both the CMS and the Astro site can be deployed to Cloudflare Pages. Make sure to set the Github Personal Access Token environment variables in the Cloudflare Pages dashboard for the CMS. The Astro site will consume the CMS data from the Github repository, so no additional environment variables are needed.
With this setup, no additional database or CI/CD setup is needed. The Github repository acts as a database and Cloudflare Pages as the CI/CD pipeline which is triggered on every push to the repository.

### Cloudflare Pages and Github Actions

Use these Github Actions to deploy the CMS and the Astro site to Cloudflare Pages.

`.github/workflows/cms-deployment.yml`

```yaml
name: CMS Deployment
on:
  push:
    branches: [main]
    paths: ["cms/**"]
jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy to Cloudflare Pages
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
      - name: Install and Build
        run: cd cms && pnpm install && pnpm run build          
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          packageManager: pnpm
          workingDirectory: cms
          # Currently, only worker secrets are supported, page secrets need to be handled manually
          # https://github.com/cloudflare/wrangler-action/issues/304
          preCommands: |
            echo '{"_GITHUB_PAT": "${{ secrets._GITHUB_PAT }}"}' > .env.json
          command: |
            pages secret bulk .env.json
            pages deploy dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

`.github/workflows/web-deployment.yml`

```yaml
name: Web Deployment
on:
  push:
    branches: [main]
    paths: ["web/**"]
jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy to Cloudflare Pages
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
      - name: Install and Build
        run: cd web && pnpm install && pnpm run build
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          packageManager: pnpm
          workingDirectory: web
          command: pages deploy dist --project-name=<REPLACE_ME_PROJECT_NAME>
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

```