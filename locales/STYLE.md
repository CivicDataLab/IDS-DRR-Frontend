# Message key style guide

Rules for naming keys in `locales/<locale>.json`.

## Principles

1. **Name by role, not by content.** A key says what a string is *for*, not what it currently *says* in English. When the English value is reworded (or translated), the key stays valid. Bad: `somethingWentWrong`, `knowYourRiskIndicators`, `overallFloodRisk`. Good: `error`, `heading`, `overallRisk`.
1. **Don't leak deployment assumptions into the key itself.** Even the default English value should read neutrally. The *branding* package is where deployment-specific wording lives. Bad: `floodHazard`, `overallFloodRisk`, `assamRegionLabel`. Good: `hazard`, `overallRisk`, `regionLabel`.
1. **Lean on the surrounding namespace.** The enclosing object provides scope. A key under `home.datasets` doesn't need `datasets` in its own name; `heading` is enough. Bad: `home.hero.heroTagline`. Good: `home.hero.tagline`.
1. **Short, single-purpose identifiers.** One key, one role. Bad: `shareButton`, `userGuideReadMoreLink`. Good: `share`, `userGuideLink`.
1. **camelCase** for multi-word keys.

## Namespaces

### Top-level layout

Each top-level key is either a cross-cutting concern (the site as a whole, common strings, error scenarios, the nav chrome) or a page / feature area. Keep these distinct; don't put page-specific strings under `common`, and don't scatter site-wide copy across page namespaces.

| Top-level key | Description |
|---|---|
| `common` | Strings reused across more than one page or feature and tied to no particular scenario. Kept intentionally thin. |
| `errors` | Each sub-namespace (`generic`, `notFound`, …) is one error scenario with its own heading and call-to-action. |
| `site` | Site-wide metadata: name, description, creator attribution, SEO keywords. Feeds HTML `<title>`, `<meta>`, Open Graph / Twitter tags. |
| `nav` | Nav link labels and controls (menu toggle). |
| `factors` | Core domain vocabulary (the risk-factor taxonomy). Each factor is an object with `name` (always) and `description` (`riskScore` has only `name`). Branding can rename individual factors, e.g. `factors.hazard.name` → "Flood Hazard". |
| `home` | Home-page section content (`hero`, `analytics`, `datasets`, `resources`). |
| `analytics` | Analytics page: sidebar, selected-region detail panel (`detail`), page-specific filter vocabulary (`filters.{division, subdivision, …}`), chart, table, etc. |
| `datasets` | Datasets list and detail pages, including pagination and the metadata field-name prefixes (`labels`) used wherever dataset metadata is rendered. |

### Adding new namespaces

Prefer the smallest, most local namespace that fits:

- **Nest under an existing page namespace** whenever the keys belong to one page (`home`, `analytics`, `datasets`).
- **Create a sub-namespace** (a scenario like `errors.generic`, a role family like `labels`, etc.) when two or more related keys share the same role family or scenario. Single one-offs stay flat.
- **Add a new top-level key** only when the strings don't fit any existing page namespace and putting them under `common` would be too generic.

### Roles and scenarios

A **role** names what a string *is* (`heading`, `retry`). A **scenario** names where or when it appears (`errors.notFound`, `datasets.detail`). The common nesting is scenario outside, role inside.

Don't flatten scenario and role into a single key; it obscures which heading pairs with which action:

```jsonc
// bad — can't tell which CTA goes with which heading
"errors": {
  "somethingWentWrong": "...",
  "pageNotFound": "...",
  "tryAgain": "...",
  "returnHome": "..."
}

// good — scenario namespace, role keys inside
"errors": {
  "generic": { "heading": "...", "retry": "..." },
  "notFound": { "heading": "...", "home": "..." }
}
```

Adding another error scenario later (`errors.unauthorized.{heading, signIn}`) slots in easily.

The inverse nesting (**role family → identifier**) is also valid when the same role applies to a series of items. Here the outer key names the repeated role and the inner keys identify the items:

- `datasets.labels.{source, lastUpdated, updateFrequency, …}`: `labels` groups the `label` role; inner keys identify each labeled field.
- `common.social.{facebook, linkedin, twitter}`: `social` groups platform labels; inner keys identify platforms.
- `analytics.chart.axes.{timePeriod, score, units}`: `axes` groups axis labels; inner keys identify axes.

Scenario-first is the default. Use role-family-first when the inner enum is a stable set of identifiers (like fields, platforms, axes) rather than a set of one-off scenarios.

### Division and subdivision

The app labels two levels of administrative geography below the state. Deployments vary in what each level is called. The default (deployment-neutral) English vocabulary is:

- Division (subdivision of a state)
- Subdivision (of a division)

Deployments can rename each level by overriding messages. Never use "District", "Revenue-circle", "Tehsil", etc. in the default messages.

## Keys

### Canonical roles

Reuse these names consistently wherever they apply. Each covers a specific structural purpose:

| Role | When to use |
|---|---|
| `heading` | An `<h1>`/`<h2>`/`<h3>` — a prose section's title |
| `tagline` | A shorter subheading or strapline beneath a heading |
| `description` | Supporting prose beneath a heading |
| `title` | Short label for a UI control or chrome element, e.g. a filter-drawer tab (`filters.division.title` → "Division") |
| `name` | Canonical display name of a thing (site, factor). Not a heading, title or form label. |
| `label` | A form-field or `<select>` label |
| `placeholder` | An `<input>` placeholder, or a `<select>`'s first unselected-state option (`{ label: '…', value: '' }`) |
| `disabledHint` | Explanatory text shown when a control is disabled |
| `emptyPrompt` | Empty-state text for a content area requiring user input ("Please select a region") |
| `loading` | Text shown while data is fetching |
| `empty` | Empty-state text for data lists ("No data available.") |
| `trigger` | Button or control that initiates a scenario (`filters.trigger` opens the filter drawer; `copy.trigger` starts a copy flow); use when the verb would repeat the scenario |
| `confirm` | `window.confirm` prompt text |
| `success` / `error` | Post-operation outcome text (`copy.success`, `copy.error`, `map.error`) |
| `<target>Link` | Anchor text for a link (`docsLink`, `sourceLink`); reserve for actual `<a>` elements, not buttons that happen to do navigation |
| `ariaLabel` | Screen-reader-only label, **only** when `aria-labelledby` can't point at a visible heading |

For button labels, prefer a **verb that names the action** (`retry`, `share`) over either the literal English label (`tryAgain`, `shareDataset`) or a generic meta-role (`cta`, `action`, `button`).

### Enumerated/identifier keys

Numeric or slug-style keys are correct when the *key itself* is a stable identifier, not an artifact of current English: `analytics.risk.1..5`, `home.datasets.categories.{hazard, exposure, …}`, `analytics.views.{map, chart, table, more}`. Don't invent slug-style keys purely to avoid a role name.

### ICU placeholders

When the value is a sentence with interpolation, name by role: `"{count} of {total} Datasets"` → `count` or `countOfTotal` (not `showing`); `"Page {current} of {total}"` → `page`; `"Calculated for {date}"` → `calculatedFor` (verb phrase describing the calculation's target).

## Values

### Punctuation

Include structural punctuation (colons, trailing spaces, full stops, bullets) in the message *value*, not concatenated at the call site. Languages punctuate differently: French puts a thin non-breaking space before `:` ("Lignes :"), Japanese uses fullwidth `：`, Chinese uses distinct sentence-ending marks. If you append `: ` in JSX, translators have no way to fix it.

Bad — colon and spacing live in code and can't be retranslated:

```jsx
<Text>{tLabels('source')}: {value}</Text>
```

Good — the value owns "Source: " (colon + trailing space); JSX just concatenates:

```jsx
<Text>{tLabels('source')}{value}</Text>
```

Applies to `label=` props on Select, too; put the colon in the value, pass the bare `t('key')` as the prop.

### Sections and aria-labels

Prefer `aria-labelledby` pointing at the visible heading over an `aria-label` on a `<section>`, to avoid duplication. Add a dedicated `ariaLabel` key only for icon-only controls or containers without a heading.
