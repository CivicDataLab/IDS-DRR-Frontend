# syntax=docker/dockerfile:1.7
# The syntax directive enables BuildKit's cache-mount feature used below.
FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# CONTEXT_SUBDIR is the path from the build context root to this repo's
# root. For a standalone build (context = this repo), leave as "." (the
# default). For a monorepo build where this repo is one of several
# siblings, set to e.g. "frontend".
ARG CONTEXT_SUBDIR=.

# BRANDING_PACKAGE is a path relative to the build context root. The
# default points at the stub inside this repo. To install real branding
# in a monorepo layout, set e.g. BRANDING_PACKAGE=ids-drr-branding (a
# sibling of this repo). Whichever path is passed ends up at
# ./branding-stub so package.json's `"ids-drr-branding": "file:./branding-stub"`
# resolves to the chosen implementation without editing package.json.
ARG BRANDING_PACKAGE=${CONTEXT_SUBDIR}/branding-stub

COPY ${CONTEXT_SUBDIR}/package.json ${CONTEXT_SUBDIR}/package-lock.json ./
COPY ${BRANDING_PACKAGE}/ ./branding-stub/

# --mount=type=cache keeps the ~/.npm download cache warm between builds.
# --force is retained deliberately to tolerate the existing peer-dep warnings.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --force --ignore-scripts

FROM base AS dev
WORKDIR /app

# Re-apply the branding-package COPY after the full repo tree comes in,
# so /app/branding-stub/ matches whatever was installed into node_modules
# above (the repo's stub would otherwise overwrite it via `COPY .`).
ARG CONTEXT_SUBDIR=.
ARG BRANDING_PACKAGE=${CONTEXT_SUBDIR}/branding-stub

COPY --from=deps /app/node_modules ./node_modules
COPY ${CONTEXT_SUBDIR}/ .
COPY ${BRANDING_PACKAGE}/ ./branding-stub/

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ARG CONTEXT_SUBDIR=.
ARG BRANDING_PACKAGE=${CONTEXT_SUBDIR}/branding-stub

COPY --from=deps /app/node_modules ./node_modules
COPY ${CONTEXT_SUBDIR}/ .
COPY ${BRANDING_PACKAGE}/ ./branding-stub/

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
