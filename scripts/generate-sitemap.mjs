#!/usr/bin/env node
// Generate sitemap.xml from TanStack routes + API data
// - Uses SITE_URL env or defaults to Firebase app URL
// - Expands dynamic routes using Google Sheets APIs (if available)

import fs from 'fs';
import path from 'path';
import process from 'process';
import url from 'url';
import dotenv from 'dotenv';

// Lazy import axios to avoid failing when not installed (but it's in deps)
const { default: axios } = await import('axios');

// Resolve repo root
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// Load env files (production preferred)
const productionEnv = path.join(repoRoot, '.env.production');
const developmentEnv = path.join(repoRoot, '.env.development');
if (fs.existsSync(productionEnv)) dotenv.config({ path: productionEnv });
else if (fs.existsSync(developmentEnv)) dotenv.config({ path: developmentEnv });

const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '') ||
  'https://buddhaword.net';

// Helpers
const todayISO = new Date().toISOString();
const encodePath = (p) => p.split('/').map(encodeURIComponent).join('/');

/** Read route tree to collect static paths (non-parameterized) */
function getStaticPathsFromRouteTree() {
  const routeTreePath = path.join(repoRoot, 'src', 'routeTree.gen.ts');
  if (!fs.existsSync(routeTreePath)) return [];

  const content = fs.readFileSync(routeTreePath, 'utf8');

  // Extract the union of `fullPaths` as a quick source
  const fullPathsMatch = content.match(/fullPaths:[\s\S]*?\n\s*([`'"].*?)[\s\S]*?fileRoutesByTo:/);
  let candidates = [];
  if (fullPathsMatch) {
    const unionBlock = content
      .split('fullPaths:')[1]
      .split('fileRoutesByTo:')[0];
    const pathRegex = /[`'"]\/(?:[^`'"\\]|\\.)*[`'"]/g;
    candidates = Array.from(unionBlock.matchAll(pathRegex)).map((m) => m[0].slice(1, -1));
  }

  // Filter non-parameterized and normalize trailing slashes -> no trailing slash except root
  const normalized = candidates
    .filter((p) => !p.includes('$'))
    .map((p) => (p === '/' ? p : p.replace(/\/$/, '')));

  // De-dup
  return Array.from(new Set(normalized));
}

async function fetchSheet(url) {
  if (!url) return [];
  try {
    const res = await axios.get(url);
    const data = res.data;
    if (!data || !Array.isArray(data.values) || data.values.length < 2) return [];
    const [headers, ...rows] = data.values;
    return rows.map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });
  } catch (e) {
    console.warn('[sitemap] Failed to fetch', url, e?.message || e);
    return [];
  }
}

function loadBuddhaNatureJson() {
  const jsonPath = path.join(repoRoot, 'src', 'assets', 'buddha-nature.json');
  if (!fs.existsSync(jsonPath)) return [];
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[sitemap] Failed to load buddha-nature.json', e?.message || e);
    return [];
  }
}

function transformBuddhaNatureItem(item) {
  // Mirror src/services/https/sutra.ts mapping for categories
  let categoryName = '';
  switch (item.category) {
    case '627515988b61fc33c0d0ea97':
      categoryName = 'ທໍາໃນເບື້ອງຕົ້ນ';
      break;
    case '627515918b61fc33c0d0ea94':
      categoryName = 'ທໍາໃນທ່າມກາງ';
      break;
    case '627515888b61fc33c0d0ea91':
      categoryName = 'ທໍາໃນທີສຸດ';
      break;
    default:
      categoryName = item.category || '';
  }
  return {
    ID: item._id,
    'ຊື່ພຣະສູດ': item.title,
    'ພຣະສູດ': item.content,
    'ຮູບ': item.thumbnail || '',
    'ໝວດທັມ': categoryName,
    'ສຽງ': '',
  };
}

async function buildUrls() {
  const urls = new Set();
  const add = (p) => {
    if (!p) return;
    const norm = p === '/' ? '/' : p.replace(/\/$/, '');
    urls.add(norm);
  };

  // 1) Static paths from route tree
  getStaticPathsFromRouteTree().forEach(add);

  // 2) Dynamic expansions
  const [sutraSheet, bookSheet, videoSheet, calendarSheet] = await Promise.all([
    fetchSheet(process.env.SUTRA_API_URL),
    fetchSheet(process.env.BOOK_API_URL),
    fetchSheet(process.env.VIDEO_API_URL),
    fetchSheet(process.env.CALENDAR_API_URL),
  ]);

  // Merge sutra sheet with local buddha-nature JSON
  const buddhaNature = loadBuddhaNatureJson().map(transformBuddhaNatureItem);
  const sutras = [...sutraSheet, ...buddhaNature];

  // 2a) Sutra categories
  const categories = Array.from(
    new Set(
      sutras
        .map((s) => s['ໝວດທັມ'])
        .filter((v) => typeof v === 'string' && v.trim() !== '')
    )
  );
  categories.forEach((c) => add(`/sutra/${encodePath(c)}`));

  // 2b) Sutra details by ID
  const sutraIds = new Set(
    sutras.map((s) => s.ID).filter((v) => typeof v === 'string' && v.trim() !== '')
  );
  Array.from(sutraIds).forEach((id) => add(`/sutra/details/${encodeURIComponent(id)}`));

  // 2c) Books and Videos
  const bookIds = new Set(
    bookSheet.map((b) => b.ID).filter((v) => typeof v === 'string' && v.trim() !== '')
  );
  Array.from(bookIds).forEach((id) => add(`/book/view/${encodeURIComponent(id)}`));

  const videoIds = new Set(
    videoSheet.map((v) => v.ID).filter((v) => typeof v === 'string' && v.trim() !== '')
  );
  Array.from(videoIds).forEach((id) => add(`/video/view/${encodeURIComponent(id)}`));

  // 2d) Calendar titles
  const calendarTitles = new Set(
    calendarSheet
      .map((c) => c.title)
      .filter((v) => typeof v === 'string' && v.trim() !== '')
  );
  Array.from(calendarTitles).forEach((t) => add(`/calendar/${encodePath(t)}`));

  // Exclude user-specific routes (favorites details)
  // Nothing to remove explicitly since not added

  return Array.from(urls).sort((a, b) => a.localeCompare(b));
}

function buildSitemapXml(paths) {
  // Simple priority heuristic
  const priorityFor = (p) => {
    if (p === '/') return '1.0';
    if (['/sutra', '/book', '/video', '/calendar', '/dhamma'].includes(p)) return '0.9';
    if (p.startsWith('/sutra/details/') || p.startsWith('/book/view/') || p.startsWith('/video/view/')) return '0.8';
    return '0.7';
  };

  const changefreqFor = (p) => {
    if (p === '/') return 'daily';
    if (p.startsWith('/sutra/details/') || p.startsWith('/video/view/')) return 'weekly';
    return 'monthly';
  };

  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const p of paths) {
    const loc = `${SITE_URL}${p}`;
    lines.push('  <url>');
    lines.push(`    <loc>${loc}</loc>`);
    lines.push(`    <lastmod>${todayISO}</lastmod>`);
    lines.push(`    <changefreq>${changefreqFor(p)}</changefreq>`);
    lines.push(`    <priority>${priorityFor(p)}</priority>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  return lines.join('\n');
}

async function main() {
  const outDir = path.join(repoRoot, 'public');
  const outFile = path.join(outDir, 'sitemap.xml');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const paths = await buildUrls();
  const xml = buildSitemapXml(paths);
  fs.writeFileSync(outFile, xml, 'utf8');
  console.log(`[sitemap] Wrote ${paths.length} URLs to ${path.relative(repoRoot, outFile)}`);

  // Update robots.txt with Sitemap line if missing
  const robotsPath = path.join(outDir, 'robots.txt');
  try {
    let robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : 'User-agent: *\nDisallow:\n';
    if (!/\nSitemap:\s*/i.test(robots)) {
      if (!robots.endsWith('\n')) robots += '\n';
      robots += `Sitemap: ${SITE_URL}/sitemap.xml\n`;
      fs.writeFileSync(robotsPath, robots, 'utf8');
      console.log('[sitemap] Ensured robots.txt contains Sitemap reference');
    }
  } catch (e) {
    console.warn('[sitemap] Failed to update robots.txt', e?.message || e);
  }
}

main().catch((e) => {
  console.error('[sitemap] Generation failed', e);
  process.exitCode = 1;
});

