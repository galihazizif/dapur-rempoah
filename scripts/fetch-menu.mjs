import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv() {
  const envPath = resolve(root, '.env');
  if (!existsSync(envPath)) return {};
  const content = readFileSync(envPath, 'utf-8');
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key === 'VITE_API_URL') vars.apiUrl = val;
  }
  return vars;
}

const env = loadEnv();
const API_URL = env.apiUrl || 'https://rempoah-api.kin.workers.dev';

async function fetchMenu() {
  const url = `${API_URL}/menu`;
  console.log(`Fetching menu from ${url}...`);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status} ${res.statusText}`);

  const data = await res.json();
  const outputPath = resolve(root, 'src/data/menu.json');
  writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Menu saved to ${outputPath} (${data.length} items)`);
}

fetchMenu().catch((err) => {
  console.error('Error fetching menu:', err.message);
  process.exit(1);
});
