import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import sharp from 'sharp';

// 从原始 PNG 生成高分屏预览，避免放大已有的低分辨率 JPEG。
const context = { window: {} };
runInNewContext(await readFile('assets/data/images.js', 'utf8'), context);
const images = context.window.TRADITIONAL_COLOR_IMAGES;
for (let offset = 0; offset < images.length; offset += 4) {
  await Promise.all(images.slice(offset, offset + 4).map((image) =>
    sharp(image.path)
      .resize({ width: 810, withoutEnlargement: true })
      .webp({ quality: 88, effort: 4 })
      .toFile(`thumbnails/color-card-${image.id}-810.webp`),
  ));
}
console.log(`Generated ${images.length} high-resolution gallery previews.`);
