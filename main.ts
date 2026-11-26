// AngkaNusa — hand-in program (Node 22, standard library only).
//
// The site lives in app/ as plain static files: one index.html shell, a
// stylesheet, and small ES modules that render every page from the figures
// in data.js. Nothing is fetched from the network at run time.
//
// This program hands the entry in: it copies app/ and screenshots/ from
// beside this file into the output directory and writes
// /output/dossier.json, the summary the judge reads, using the vendored
// make.fun library. vendor/makefun-frontend.ts must stay exactly as the
// kit shipped it — the scorer rebuilds the dossier with its own copy and
// compares the two byte for byte.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Caps mirror the gate: at most 4 screenshots of 256 KiB each, app/ at most
// 993 entries and 16 MiB, and the dossier text at most 160 KiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
