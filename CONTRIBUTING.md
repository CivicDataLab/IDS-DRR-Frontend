# Contributing to IDS-DRR Frontend

Thank you for your interest in contributing. This project is maintained by [CivicDataLab](https://civicdatalab.in) and we welcome contributions from web developers, designers, and civic technologists.

---

## Ways to contribute

| Type | How |
|------|-----|
| Bug reports | Open a [GitHub issue](https://github.com/CivicDataLab/IDS-DRR-Frontend/issues) |
| Feature suggestions | Open an issue first, then a PR after alignment |
| Documentation fixes | PR directly against `dev` |
| Questions and partnerships | Email <info@civicdatalab.in> |

---

## Before you open a pull request

1. **Check for an open issue.** Search [existing issues](https://github.com/CivicDataLab/IDS-DRR-Frontend/issues) before opening a new one to avoid duplication.
1. **For non-trivial changes, open an issue first.** This lets us align on scope before you invest time writing code.
1. **Reference the issue in your PR description.** Use `Closes #<issue-number>` or `Relates to #<issue-number>`.

---

## Development setup

```bash
git clone https://github.com/CivicDataLab/IDS-DRR-Frontend.git
cd IDS-DRR-Frontend
npm install --force
cp .env .env.local # then edit values as needed
npm run dev
```

The app will be available at <http://localhost:3000>. With no branding configured, the app runs against the empty in-repo stub; features like the About page or partner logos are hidden, and the analytics and map pages work normally. Charts and datasets additionally require a [DataSpace Backend](https://github.com/CivicDataLab/DataSpaceBackend) configured via `BACKEND_URL` / `NEXT_PUBLIC_BACKEND_URL`.

See [How the branding package works](README.md#how-the-branding-package-works) for instructions on running against a real deployment branding.

---

## Submitting a pull request

1. Fork the repository and create a branch from `dev`.
1. Make your changes. Keep commits focused: one logical change per commit.
1. Confirm tests pass: `npm run test`.
1. Confirm type-check and lint pass: `npm run type-check && npm run lint`.
1. Open a PR against `dev` with a clear title and a brief description of what changed and why.

---

## Code style

Code style is enforced by ESLint and TypeScript:

```bash
npm run lint       # ESLint, zero warnings
npm run type-check # TypeScript, zero errors
```

- Match the existing patterns in the repository.
- Avoid adding dependencies not already in `package.json` without discussion.
- When adding or renaming translation message keys in `locales/<locale>.json`, follow [`locales/STYLE.md`](locales/STYLE.md).
- Deployment-specific content (a logo, a partner name, the About-page copy, the glossary CSV) belongs in the relevant branding repo (e.g. `ids-drr-india-branding`), not in this repo. See the README for the boundary.

---

## License

By contributing, you agree that your contributions will be licensed under the [GNU AGPL v3.0](LICENSE).
