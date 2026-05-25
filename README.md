# IDS-DRR Frontend

The frontend for **IDS-DRR** (Intelligent Data Solution for Disaster Risk Reduction), built with **React 19**, **Next.js 15**, **TypeScript**, and **GraphQL**.

This repository ships with **no deployment-specific content**. All branding, copy, languages, states, partners, "About" page, footer, etc. live in a separate **branding package** that is plugged in at install time. This keeps the core app reusable across deployments while individual deployments (e.g. India) maintain their own content in their own repos.

<!-- once repo transfered -->

> Branding contract: [ids-drr-branding-types](https://github.com/CivicDataLab/ids-drr-branding-types).

> Example branding implementation: [ids-drr-india-branding](https://github.com/CivicDataLab/ids-drr-india-branding).

![Coverage](https://img.shields.io/badge/Tests_Coverage-60%25-yellow)

---

## Table of contents

- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [How the branding package works](#how-the-branding-package-works)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [License](#license)

---

## Requirements

- **Node.js** v22.x (LTS) — matches the version used in CI (`.github/workflows/pre-merge.yml`)
- **npm** v10+
- A code editor with **Prettier** and **ESLint** integration (configs are committed in `package.json`)

You do **not** need Docker, the India branding repo, or any deployment credentials to develop or contribute.

---

## Quick start

```bash
git clone https://github.com/CivicDataLab/IDS-DRR-Frontend.git
cd IDS-DRR-Frontend
npm install --force
cp .env .env.local        # then edit values as needed (see below)
npm run dev
```

The app will be available at <http://localhost:3000>.

> `--force` is intentional. The Next.js 15 / React 19 / `opub-ui` peer-dep tree emits a handful of harmless warnings; CI uses the same flag (`.github/workflows/pre-merge.yml`).

With no branding configured, the app runs against an empty in-repo "stub" — features like the About page or partner logos are hidden, and the rest of the app (charts, maps, datasets, search) works normally. That's the right experience for working on the core frontend.

---

## Environment variables

Copy `.env` to `.env.local` and adjust. Most of these have sensible defaults; the only ones you'll typically need to change for local work are the backend URLs.

| Variable                                | Purpose                                                                                                                                                    | Required for local dev?                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `BACKEND_URL`                           | URL of a [DataSpaceBackend](https://github.com/CivicDataLab/DataSpaceBackend) deployment (Django + GraphQL). Used server-side for the datasets/search API. | Yes, if you're working on dataset pages |
| `NEXT_PUBLIC_BACKEND_URL`               | Same DataSpaceBackend URL, exposed to the browser. Its presence also enables `features.datasets` (the datasets nav link and pages).                        | Yes, if you're working on dataset pages |
| `DATA_MANAGEMENT_LAYER_URL`             | URL of an [IDS-DRR-Data-Management](https://github.com/CivicDataLab/IDS-DRR-Data-Management) deployment. Used server-side.                                 | Yes, for analytics / SSR pages          |
| `NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL` | Same data-management URL, exposed to the browser.                                                                                                          | Yes, for analytics / SSR pages          |
| `SITE_URL`                              | Canonical site URL (used in metadata and OG tags).                                                                                                         | Optional                                |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_APP_ID`   | GA4 property id.                                                                                                                                           | Optional                                |
| `SENTRY_*`                              | Error tracking.                                                                                                                                            | Optional in dev                         |

> Any variable prefixed with `NEXT_PUBLIC_` is bundled into the client JavaScript — never put secrets in those.

---

## How the branding package works

This section is short but worth reading once — almost every "where do I add this?" question comes back to it.

The frontend imports a single npm package called `ids-drr-branding`. The **contract** for that package — the shape of its `config` object and the optional React components it can export — is defined by [ids-drr-branding-types](https://github.com/CivicDataLab/ids-drr-branding-types). That repo's `src/index.ts` is the source of truth; the inline comments there are the canonical documentation of every configurable field (states, resources, locales, messages, brand assets, links, feature flags, and so on).

Different deployments provide **different implementations** of that contract. They all use the same package name (`ids-drr-branding`) so they're drop-in replacements for each other.

| Implementation                           | Where it lives                                                                   | When it's used                                         |
| ---------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Stub** (empty)                         | `branding-stub/` in this repo                                                    | Default. OSS dev, CI, anyone without deployment access |
| **India** (example implementation)       | [ids-drr-india-branding](https://github.com/CivicDataLab/ids-drr-india-branding) | The India deployment. Read this for a worked example.  |
| **Your deployment** (future state / org) | your own repo, following the contract from `ids-drr-branding-types`              | Any new deployment that forks IDS-DRR                  |

`package.json` declares `"ids-drr-branding": "file:./branding-stub"`, so by default the stub is what gets installed. The stub exports `undefined` for every optional component and `{}` for `config`. The frontend handles those gracefully — `app/[locale]/about-us/page.tsx`, for example, returns a 404 when no `AboutPage` is provided.

**Where new code should live:**

- Generic feature (chart, map, search, GraphQL query, layout, i18n machinery): **this repo**.
- Deployment-specific content (a logo, a partner name, the About-page copy, the glossary CSV): **the relevant branding repo** (e.g. `ids-drr-india-branding` for India).

If you're not sure which side a change belongs on, open an issue and ask before opening the PR.

**Example: Running locally with the real India branding:**

If you also have the `ids-drr-india-branding` repo cloned somewhere on disk and want to develop against it:

```bash
# from this repo's root
npm install --no-save --install-links file:/absolute/path/to/ids-drr-india-branding
```

- `--no-save` keeps `package.json` and `package-lock.json` unchanged. The lockfile must stay pinned to the stub so OSS contributors and CI are unaffected.
- `--install-links` copies the package contents instead of symlinking, so its transitive deps resolve correctly.

You'll need to re-run that command after any subsequent `npm install` or `npm ci` (those revert `node_modules/ids-drr-branding` back to the stub). To return to the stub explicitly, just run `npm install --force` again.

> If you only intend to contribute generic improvements to the frontend, you do **not** need this step. Stay on the stub.

---

## Available scripts

| Script                  | What it does                                                 |
| ----------------------- | ------------------------------------------------------------ |
| `npm run dev`           | Start the Next.js dev server + GraphQL codegen in watch mode |
| `npm run build`         | Generate GraphQL types and build the production bundle       |
| `npm start`             | Start the built production server                            |
| `npm run lint`          | ESLint — zero warnings allowed                               |
| `npm run type-check`    | `tsc --noEmit`                                               |
| `npm run knip`          | Detect unused files, exports, and dependencies               |
| `npm run test`          | Jest test suite                                              |
| `npm run test:watch`    | Jest in watch mode                                           |
| `npm run test:coverage` | Jest with coverage report                                    |
| `npm run generate`      | GraphQL codegen in watch mode                                |
| `npm run build:tokens`  | Regenerate design tokens (Style Dictionary)                  |
| `npm run clean`         | Remove `node_modules` and `package-lock.json`                |

---

## Project structure

```
IDS-DRR-Frontend/
├── app/                  # Next.js App Router pages (locale-prefixed)
├── branding-stub/        # Empty default branding package (package name: ids-drr-branding)
├── components/           # Shared React components
├── config/
│   ├── branding.ts       # Re-exports the branding namespace with safe defaults
│   ├── site.ts           # Site-wide config derived from branding.config
│   └── codegen.ts        # GraphQL codegen config
├── gql/                  # GraphQL queries and generated types
├── hooks/                # Reusable React hooks
├── i18n/                 # next-intl setup
├── lib/                  # Pure utilities (routes, formatters, glossary, ...)
├── locales/              # Frontend-owned base translations
├── public/               # Static assets shipped with the core app
├── styles/tokens/        # Design tokens (Style Dictionary output)
├── tests/                # Jest tests and fixtures
├── types/                # Shared TS types
├── next.config.ts
└── tailwind.config.js
```

For the branding contract, see [ids-drr-branding-types](https://github.com/CivicDataLab/ids-drr-branding-types) (covered above in [How the branding package works](#how-the-branding-package-works)).

---

## License

[MIT](./LICENSE) © CivicDataLab
