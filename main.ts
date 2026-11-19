// Leonida Trophy Guide — the entry program for gta6-trophy-guide-01.
//
// What it does: takes this repository's guide (app/) and its screenshots
// (screenshots/), copies both into the output directory, and writes
// dossier.json there with the vendored make.fun library. The judge reads
// that dossier — screenshots first, then an outline of the source — so the
// program's only job is to hand the guide over exactly as it stands.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// then open out/app/index.html, or serve app/ live with `node serve.ts`
// (http://localhost:8080). The grader runs it with /output as the target.
//
// The dossier call keeps the scorer's own caps: at most 4 screenshots of
// 256 KiB, at most 993 files / 48 MiB under app/, and the dossier text
// capped at 160 KiB. Those numbers come from the competition's gate
// (competition.yaml / reference/gate.json in the kit); changing them would
// make the dossier differ from the one the scorer writes itself.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message) {
  throw new Error(`leonida-trophy-guide: ${message}`);
}

function checkReadableDir(path, label) {
  if (!existsSync(path) || !statSync(path).isDirectory()) fail(`${label} is missing: ${path}`);
}

// The guide itself. index.html must exist or there is nothing to hand in.
const appDir = join(repoRoot, 'app');
checkReadableDir(appDir, 'app/');
if (!existsSync(join(appDir, 'index.html'))) fail('app/index.html is missing');

// The screenshots the judge reads. The gate wants 3 or 4 images.
const shotsDir = join(repoRoot, 'screenshots');
checkReadableDir(shotsDir, 'screenshots/');
const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
if (shots.length < 3 || shots.length > 4) fail(`expected 3 or 4 screenshots, found ${shots.length}`);

mkdirSync(outDir, { recursive: true });
cpSync(appDir, join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

// The dossier is built by the vendored library from exactly what was just
// copied, so it always matches the output the scorer rebuilds itself.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

console.log(`handed in ${shots.length} screenshots and app/ (${readdirSync(appDir).length} top-level entries) to ${outDir}`);
