// Looks up each seed candidate on Wikidata and writes docs/wikidata-matches.csv for human review.
// Mark a row approved with "yes" and generate-seed.mjs will use its details.

import { readCsv, writeCsv } from './csv.mjs';

const API = 'https://www.wikidata.org/w/api.php';
const HUMAN = 'Q5';
const DAY_PRECISION = 11;
const REQUEST_GAP_MS = 1500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function wikidata(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', ...params })}`;

  for (let attempt = 0; attempt < 8; attempt++) {
    await sleep(REQUEST_GAP_MS);
    const response = await fetch(url, {
      headers: { 'User-Agent': 'KingmakerFantasyElections/0.1 (candidate seed script)' },
    });
    if (response.ok) return response.json();
    await sleep(Number(response.headers.get('retry-after') ?? 15) * 1000);
  }

  throw new Error(`Wikidata request failed: ${url}`);
}

function claim(entity, property) {
  return entity.claims?.[property]?.[0]?.mainsnak?.datavalue?.value;
}

function isHuman(entity) {
  return (entity.claims?.P31 ?? []).some((c) => c.mainsnak?.datavalue?.value?.id === HUMAN);
}

// Has a party membership or has held a position.
function isPolitician(entity) {
  return Boolean(entity.claims?.P102 || entity.claims?.P39);
}

function label(entity) {
  return entity.labels?.en?.value ?? entity.labels?.mul?.value;
}

function birthDate(entity) {
  const value = claim(entity, 'P569');
  return value?.precision === DAY_PRECISION ? value.time.slice(1, 11) : '';
}

function photoUrl(entity) {
  const file = claim(entity, 'P18');
  return file ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}` : '';
}

async function match(name) {
  const search = await wikidata({
    action: 'wbsearchentities',
    search: name,
    language: 'en',
    type: 'item',
    limit: '7',
  });
  const ids = search.search.map((result) => result.id);
  if (ids.length === 0) return { name, status: 'review' };

  const { entities } = await wikidata({
    action: 'wbgetentities',
    ids: ids.join('|'),
    props: 'labels|descriptions|claims|sitelinks',
    languages: 'en|mul',
    sitefilter: 'enwiki',
  });
  const humans = ids.map((id) => entities[id]).filter(isHuman);
  if (humans.length === 0) return { name, status: 'review' };

  const best = humans.find(isPolitician) ?? humans[0];
  const others = humans.filter((entity) => entity !== best);
  const bestLabel = label(best);
  const sameName = others.filter((entity) => label(entity) === bestLabel);

  return {
    name,
    wikidata_id: best.id,
    label: bestLabel,
    description: best.descriptions?.en?.value,
    birth_date: birthDate(best),
    photo_url: photoUrl(best),
    wikipedia_title: best.sitelinks?.enwiki?.title,
    status: sameName.length > 0 || bestLabel !== name ? 'review' : 'ok',
    other_matches: others.map((e) => `${e.id}: ${e.descriptions?.en?.value ?? ''}`).join(' | '),
  };
}

const rows = [];
for (const { name } of readCsv('docs/seed-candidates.csv')) {
  rows.push(await match(name));
}

writeCsv(
  'docs/wikidata-matches.csv',
  [
    'name',
    'wikidata_id',
    'label',
    'description',
    'birth_date',
    'photo_url',
    'wikipedia_title',
    'status',
    'approved',
    'other_matches',
  ],
  rows
);

console.log(`Wrote ${rows.length} matches, ${rows.filter((r) => r.status === 'review').length} need review.`);
