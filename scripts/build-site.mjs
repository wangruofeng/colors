import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const directories = ['assets', 'colors', 'docs', 'images', 'skills', 'thumbnails'];
for (const entry of await readdir(root)) {
  if (directories.includes(entry) || /\.(html|svg|txt|xml)$/.test(entry) || entry === 'LICENSE') {
    await cp(path.join(root, entry), path.join(out, entry), { recursive: true });
  }
}
await mkdir(path.join(out, 'downloads'), { recursive: true });
// The source archive includes all editable code and build inputs. The image
// assets are served unmodified at the paths listed in assets/data/images.js.
execFileSync('git', ['archive', '--format=zip', '--output=' + path.join(out, 'downloads/source.zip'), 'HEAD',
  '.', ':!images', ':!thumbnails', ':!docs/screenshots', ':!docs/images', ':!skills/share-cards'], { cwd: root });
await writeFile(path.join(out, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
/downloads/source.zip
  Content-Disposition: attachment; filename="colors-source.zip"
`);
let count = 0;
async function verify(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) await verify(file);
    else {
      count++;
      if ((await stat(file)).size > 25 * 1024 * 1024) throw new Error(`Pages file too large: ${file}`);
    }
  }
}
await verify(out);
if (count > 20000) throw new Error(`Pages file count exceeded: ${count}`);
console.log(`Built ${count} static files in dist; all files within Pages limits.`);
