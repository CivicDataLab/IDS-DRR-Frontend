# syntax=docker/dockerfile:1.7
# The syntax directive enables BuildKit's cache-mount feature used below.
FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Path to this repo within the build context. The default works for a
# standalone build; set to e.g. "frontend" when the context is a monorepo.
ARG CONTEXT_SUBDIR=.

# Path to the branding package within the build context. The default is the
# in-repo stub; set to a sibling directory like "ids-drr-branding" for a real
# implementation. It's COPYed to ./branding-stub, so that the `file:` dep in
# package.json resolves without edits.
ARG BRANDING_PACKAGE=${CONTEXT_SUBDIR}/branding-stub

COPY ${CONTEXT_SUBDIR}/package.json ${CONTEXT_SUBDIR}/package-lock.json ./

# Install against the branding-stub package first, so that branding-only edits
# use the cached `npm ci` step.
COPY ${CONTEXT_SUBDIR}/branding-stub/ ./branding-stub/

# --mount=type=cache keeps the ~/.npm download cache warm between builds.
# --force is retained deliberately to tolerate the existing peer-dep warnings.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --force --ignore-scripts

# Swap in the real branding package. The symlink at node_modules/
# ids-drr-branding (created by `npm ci`) now resolves to the new contents.
COPY ${BRANDING_PACKAGE}/ ./branding-stub/



FROM base AS dev
WORKDIR /app

# Source is bind-mounted at runtime, so the image only needs node_modules.
COPY --from=deps /app/node_modules ./node_modules



FROM base AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

ARG CONTEXT_SUBDIR=.
ARG BRANDING_PACKAGE=${CONTEXT_SUBDIR}/branding-stub

COPY --from=deps /app/node_modules ./node_modules
COPY ${CONTEXT_SUBDIR}/ .
COPY ${BRANDING_PACKAGE}/ ./branding-stub/

ARG NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_TIME_PERIOD
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_APP_ID
ARG NEXT_PUBLIC_GOOGLE_TRANSLATE_KEY
ARG NEXT_PUBLIC_DOWNLOAD_REPORT_LINK
ENV NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL=$NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_TIME_PERIOD=$NEXT_PUBLIC_TIME_PERIOD
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS_APP_ID=$NEXT_PUBLIC_GOOGLE_ANALYTICS_APP_ID
ENV NEXT_PUBLIC_GOOGLE_TRANSLATE_KEY=$NEXT_PUBLIC_GOOGLE_TRANSLATE_KEY
ENV NEXT_PUBLIC_DOWNLOAD_REPORT_LINK=$NEXT_PUBLIC_DOWNLOAD_REPORT_LINK

RUN npm run build



FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
