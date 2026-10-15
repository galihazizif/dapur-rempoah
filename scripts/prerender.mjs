import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const distHtmlPath = resolve(root, 'dist', 'index.html');
const serverBundlePath = resolve(root, 'dist-server', 'entry-server.js');

if (!existsSync(distHtmlPath)) {
  console.error('dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

if (!existsSync(serverBundlePath)) {
  console.error(
    'dist-server/entry-server.js not found. Run `vite build --ssr src/entry-server.jsx --outDir dist-server` first.'
  );
  process.exit(1);
}

const { render } = await import(pathToFileURL(serverBundlePath).href);
const appHtml = render('/');

let html = readFileSync(distHtmlPath, 'utf-8');

if (!html.includes('<div id="root"></div>')) {
  console.error('Could not find <div id="root"></div> in dist/index.html');
  process.exit(1);
}

html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
writeFileSync(distHtmlPath, html);

console.log(`Prerendered "/" into dist/index.html (${appHtml.length} chars)`);
