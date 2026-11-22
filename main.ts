// gta6-meme-x-01 — "Post a GTA 6 meme on X".
//
// The entry is the X post itself, not this program. All main.ts does is hand
// POST.json (the post's address) to the grader by copying it into /output.
// The house then reads the post from X — its first picture and its text —
// and that is what the judge sees. Nothing this program writes is judged.
//
// Runs on Node 22, standard library only, no network, no clock:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`could not copy POST.json from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Fail loudly instead of handing the gate a broken file: the copied
// POST.json must parse and name a post address.
try {
  const post = JSON.parse(readFileSync(join(OUTPUT_DIR, 'POST.json'), 'utf8')) as unknown;
  if (typeof post !== 'object' || post === null || typeof (post as { url?: unknown }).url !== 'string' || !(post as { url: string }).url) {
    throw new Error('POST.json has no url string');
  }
} catch (err) {
  console.error(`POST.json is not a valid post file: ${(err as Error).message}`);
  process.exit(1);
}
