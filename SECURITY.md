# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in this repository, **please do not open a public GitHub issue**. Instead, report it privately by emailing **<info@civicdatalab.in>** with the subject line `[SECURITY] IDS-DRR-Frontend`.

Please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept (if available)
- Any suggested fix or mitigation

We will acknowledge your report within **5 business days** and aim to resolve confirmed vulnerabilities within **30 days**. We will credit reporters in the release notes unless you request otherwise.

---

## Scope

This repository contains:

- A Next.js application that renders analytics maps, dashboards, and report views
- TypeScript and React components, styled with Tailwind and design tokens
- A GraphQL client that consumes the [IDS-DRR Data Management](https://github.com/CivicDataLab/IDS-DRR-Data-Management) API and (optionally) a [DataSpace Backend](https://github.com/CivicDataLab/DataSpaceBackend) instance

Security concerns relevant to this scope include: dependency vulnerabilities, cross-site scripting via untrusted content rendered in the UI, and unintended exposure of analytics tokens or other configuration via the bundle.

Deployments are responsible for securing their own hosting infrastructure, TLS termination, and any analytics, error-reporting, or CDN services they integrate.

---

## Privacy

The frontend does not collect or store personally identifiable information (PII). Optional integrations exist with Google Analytics, Hotjar, and Sentry; these are off by default and each requires an explicit environment-variable opt-in per deployment. Deployments using these integrations are responsible for disclosing them in their own privacy policy.

---

## Dependencies

Frontend dependencies are declared in [`package.json`](package.json). We recommend periodic audits using `npm audit`:

```bash
npm audit
```

---

## Contact

For security or privacy concerns, contact **CivicDataLab** at <info@civicdatalab.in>.
