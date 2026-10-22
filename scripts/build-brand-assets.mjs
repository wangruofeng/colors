import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const source = await readFile(new URL('favicon.svg', root));
const output = new URL('assets/brand/', root);
await mkdir(output, { recursive: true });
for (const size of [16, 32, 48, 180, 192, 512, 1024]) {
  await sharp(source, { density: 1536 }).resize(size, size).png()
    .toFile(fileURLToPath(new URL(`icon-${size}.png`, output)));
}
// ICO supports PNG frames; preserve the same SVG geometry at every size.
const frames = await Promise.all([16, 32, 48].map(size =>
  readFile(new URL(`icon-${size}.png`, output))));
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, i) => {
  const entry = 6 + i * 16;
  header[entry] = [16, 32, 48][i];
  header[entry + 1] = header[entry];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile(new URL('favicon.ico', output), Buffer.concat([header, ...frames]));
console.log('已从 favicon.svg 生成 7 个尺寸的 PNG 和多尺寸 ICO。');
