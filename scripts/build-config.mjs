// Reads the configuration file and writes config/site.generated.json.
//
// The TOML path defaults to ../config.toml but can be overridden with the
// CONFIG_PATH environment variable.
//
// Paths under public/ (like "public/logo/ASDMA.png") are rewritten to URLs
// that Next.js serves from its public directory ("/logo/ASDMA.png").
//
// Pass --watch to keep watching the TOML and regenerate on change.

import { existsSync, readFileSync, watchFile, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'smol-toml';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tomlPath = resolve(projectRoot, process.env.CONFIG_PATH || 'config.toml');
const outPath = resolve(projectRoot, 'config', 'site.generated.json');

const ASSET_FIELDS = new Set(['logo', 'icon', 'hero_image']);

function toAssetUrl(value) {
  if (typeof value !== 'string') return value;
  if (value.startsWith('public/')) return '/' + value.slice('public/'.length);
  return value;
}

function rewriteAssetUrls(node) {
  if (Array.isArray(node)) return node.map(rewriteAssetUrls);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = ASSET_FIELDS.has(key) ? toAssetUrl(value) : rewriteAssetUrls(value);
    }
    return out;
  }
  return node;
}

function build() {
  let config = {};
  if (existsSync(tomlPath)) {
    try {
      config = rewriteAssetUrls(parse(readFileSync(tomlPath, 'utf8')));
      console.log(`Read ${tomlPath}`);
    } catch (err) {
      console.error(`Failed to parse ${tomlPath}: ${err.message}`);
      return;
    }
  } else {
    console.warn(`No config at ${tomlPath}; writing empty config.`);
  }
  writeFileSync(outPath, JSON.stringify(config, null, 2) + '\n');
  console.log(`Wrote ${outPath}`);
}

build();

if (process.argv.includes('--watch')) {
  console.log(`Watching ${tomlPath} for changes.`);
  watchFile(tomlPath, { interval: 1000 }, (curr, prev) => {
    if (curr.mtimeMs === prev.mtimeMs) return;
    build();
  });
}
