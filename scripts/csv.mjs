import { readFileSync, writeFileSync } from 'node:fs';

function parseLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (quoted && char === '"' && line[i + 1] === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }

  cells.push(cell);
  return cells;
}

export function readCsv(path) {
  const [header, ...lines] = readFileSync(path, 'utf8').trim().split('\n').map(parseLine);
  return lines.map((cells) => Object.fromEntries(header.map((key, i) => [key, cells[i] ?? ''])));
}

function formatCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function writeCsv(path, columns, rows) {
  const lines = [columns, ...rows.map((row) => columns.map((key) => row[key]))];
  writeFileSync(path, lines.map((cells) => cells.map(formatCell).join(',')).join('\n') + '\n');
}
