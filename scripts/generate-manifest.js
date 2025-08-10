#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const imagesRoot = path.resolve(__dirname, '..', 'assets', 'images');
const outputPath = path.join(imagesRoot, 'manifest.json');

const isImage = (name) => /\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(name);

function buildManifest(rootDir) {
  const manifest = {};
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const folder = entry.name;
    const folderPath = path.join(rootDir, folder);
    const files = fs.readdirSync(folderPath, { withFileTypes: true })
      .filter((f) => f.isFile() && isImage(f.name))
      .map((f) => `/assets/images/${folder}/${f.name}`);
    manifest[folder] = files;
  }
  return manifest;
}

const manifest = buildManifest(imagesRoot);
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
console.log(`Wrote manifest to ${outputPath}`);