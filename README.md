# Hvitis.dev

Personal blog and browser tools built with Next.js, TypeScript, and Contentlayer.

Use the Node.js version in `.nvmrc` and Yarn 3.6.1. `yarn.lock` is the dependency lockfile.

## Development

```bash
nvm install
nvm use
corepack enable
yarn install --immutable
yarn dev
```

Open http://localhost:3000. The blog index is at `/blog`.

Copy `.env.example` to `.env.local` to configure optional integrations.

## Build and checks

```bash
yarn lint
yarn build
yarn serve
```

`yarn lint` reports lint errors. `yarn lint:fix` applies automatic fixes.
`yarn build` compiles the site and generates RSS feeds. `yarn serve` starts the production server.

The browser tests use Docker and run against the URL in `tests/robot/tests/e2e/mosaic.robot`.

```bash
yarn test:e2e
```

## Repository layout

| Location                                    | Contents                                                |
| ------------------------------------------- | ------------------------------------------------------- |
| `app/`                                      | Routes, page metadata, and local fonts                  |
| `components/`, `layouts/`                   | Reusable interface components and page layouts          |
| `css/`, `interfaces/`, `locales/`, `utils/` | Styles, types, translations, and helpers                |
| `data/blog/`, `data/authors/`               | Blog posts and author profiles                          |
| `public/`                                   | Published images and other static assets                |
| `config/`                                   | ESLint, Prettier, Tailwind, and SonarQube configuration |
| `scripts/`                                  | RSS generation and content maintenance tools            |
| `tests/robot/`                              | Browser tests and their Docker Compose file             |

`package.json` points ESLint, Prettier, and PostCSS to their configuration. PostCSS loads Tailwind from `config/tailwind.cjs`.
Next.js, Contentlayer, and TypeScript configuration files stay at the root for automatic discovery.
Dependencies and generated build files are ignored by Git.

## Blog images

Store published images in `public/static/images/blog/<project>/`. Keep screenshots and temporary exports out of the repository root.

To capture the LanternHouse project website, keep its repository beside this repository and run:

```bash
node scripts/capture-lanternhouse.mjs
```

The script uses the project's static export and Playwright installation. It requires `cwebp`.
It captures five views, saves optimized WebP images, and adds them to the Lanternwood House post.
