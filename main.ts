// gta6-clipper-01 entry: the program's only job is to hand VIDEO.json to the
// gate. The video itself — a vertical GTA 6 clip with a make.fun pitch — is
// the entry; nothing scored lives in this file.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = join(botDir, 'VIDEO.json');
const target = join(outDir, 'VIDEO.json');

if (!existsSync(source)) {
  console.error(`VIDEO.json not found in ${botDir}`);
  process.exit(1);
}

// Fail loudly on a malformed VIDEO.json instead of handing the gate junk:
// it must be a JSON object naming a video address in its url field.
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch {
  console.error('VIDEO.json is not valid JSON');
  process.exit(1);
}
if (
  typeof parsed !== 'object' ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== 'string'
) {
  console.error('VIDEO.json must be a JSON object with a url string');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
