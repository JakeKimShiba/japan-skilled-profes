const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../public/resources/universities_english.csv');
const mapping = {
  'finland':'FI','denmark':'DK','japan':'JP','spain':'ES','china':'CN','australia':'AU','united states of america':'US','united states':'US','united kingdom':'GB','belgium':'BE','sweden':'SE','hong kong':'HK','netherlands':'NL','germany':'DE','republic of korea':'KR','russian federation':'RU','india':'IN','singapore':'SG','taiwan':'TW','mexico':'MX','canada':'CA','austria':'AT','qatar':'QA','israel':'IL','norway':'NO','switzerland':'CH','portugal':'PT','brazil':'BR','macao':'MO','malaysia':'MY','argentina':'AR','south africa':'ZA','italy':'IT','saudi arabia':'SA','united arab emirates':'AE','korea':'KR'
};

function splitLine(line) {
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuotes = !inQuotes;
    if (ch === ',' && !inQuotes) {
      // continue to find last comma
    }
  }
  // Find last comma not inside quotes
  let idx = -1;
  inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuotes = !inQuotes;
    if (ch === ',' && !inQuotes) idx = i;
  }
  if (idx === -1) return [line, ''];
  const a = line.slice(0, idx);
  const b = line.slice(idx + 1);
  return [a, b];
}

const raw = fs.readFileSync(filePath, 'utf8');
const lines = raw.split(/\r?\n/);
const out = lines.map(line => {
  if (!line.trim()) return line;
  // skip commented
  if (line.trim().startsWith('#')) return line;
  const [namePart, countryPart] = splitLine(line);
  const countryRaw = countryPart ? countryPart.trim().replace(/^\"|\"$/g,'') : '';
  const key = countryRaw.toLowerCase();
  if (mapping[key]) {
    return `${namePart},${mapping[key]}`;
  }
  // Try to normalize common variations
  if (key === 'hong kong') return `${namePart},HK`;
  if (key === 'macau' || key === 'macao') return `${namePart},MO`;
  if (!countryRaw) return `${namePart},`;
  // If already 2-letter code, uppercase it
  if (/^[A-Za-z]{2}$/.test(countryRaw)) return `${namePart},${countryRaw.toUpperCase()}`;
  // Otherwise keep original
  return `${namePart},${countryRaw}`;
});

fs.writeFileSync(filePath, out.join('\n'));
console.log('Standardization complete. Lines:', out.length);
