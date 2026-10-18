import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:3001';
const OUT = '/workspace/realestate/screenshots';
const browser = await chromium.launch();
const errors = [];
async function shot(name, path, { width = 1440, height = 900, full = true, wait = 1500, action } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: width < 500 ? 2 : 1 });
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name} console: ${m.text()}`); });
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  if (action) await action(page);
  await page.waitForTimeout(wait);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  await page.close();
  console.log('saved', name);
}
await shot('home', '/');
await shot('home-mobile', '/', { width: 390, height: 844 });
await shot('search-map', '/search/?deal=rent', { full: false, wait: 3000 });
await shot('search-buy-map', '/search/?deal=buy&verified=1', { full: false, wait: 3000 });
await shot('property-detail', '/property/blr-003/', { wait: 3000 });
await shot('property-detail-rent', '/property/blr-001/', { full: false });
await shot('post-property', '/post/');
await shot('deposit-safe', '/deposit-safe/');
await shot('project-tracker', '/project-tracker/');
await shot('pricing', '/pricing/');
await shot('chat-widget', '/', { full: false, action: async (p) => { await p.click('button[aria-label="Open assistant"]'); await p.click('text=Is my number masked?'); } });
await browser.close();
console.log('ERRORS', JSON.stringify(errors, null, 1));
