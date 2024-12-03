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
