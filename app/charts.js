// AngkaNusa — charts.js
//
// Hand-drawn SVG charts, no library: a line chart, a vertical bar chart,
// a horizontal bar chart and a donut. Each builder takes plain data and
// returns an SVG string; colours come from the site palette in style.css
// via currentColor-friendly fixed hex values so the charts also read in
// the dossier text.

import { fmt, fmtCompact, esc } from './format.js';

const INK = '#1e2a26';
const MUTED = '#5d6d66';
const TEAL = '#17806b';
const AMBER = '#e07840';
const SAND = '#e9e2d2';
const GRID = '#d8d2c2';

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = span / count;
  const mag = 10 ** Math.floor(Math.log10(step));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const start = Math.floor(min / s) * s;
  const ticks = [];
  for (let v = start; v <= max + 1e-9; v += s) ticks.push(v);
  return ticks;
}

// Line chart: points is [{label, value}]; valueLabel formats a value.
export function lineChart(points, { height = 220, color = TEAL, valueLabel = (v) => fmt(v, 1), yLabel = '' } = {}) {
  const w = 640;
  const h = height;
  const padL = 52;
  const padR = 14;
  const padT = 18;
  const padB = 30;
  const values = points.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min > 0) min = Math.max(0, min - (max - min) * 0.25);
  const ticks = niceTicks(min, max, 4);
  min = Math.min(min, ticks[0]);
  max = Math.max(max, ticks[ticks.length - 1]);
  const x = (i) => padL + ((w - padL - padR) * i) / (points.length - 1);
  const y = (v) => padT + ((h - padT - padB) * (max - v)) / (max - min);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${path} L${x(points.length - 1).toFixed(1)},${y(min).toFixed(1)} L${x(0).toFixed(1)},${y(min).toFixed(1)} Z`;
  const dots = points
    .map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4.5" fill="#fff" stroke="${color}" stroke-width="2.5"><title>${esc(p.label)}: ${esc(valueLabel(p.value))}</title></circle>`)
    .join('');
  const labels = points
    .map((p, i) => `<text x="${x(i).toFixed(1)}" y="${y(p.value) - 10}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${esc(valueLabel(p.value))}</text>`)
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafik garis ${esc(yLabel)}" class="chart">
    ${ticks.map((t) => `<line x1="${padL}" y1="${y(t)}" x2="${w - padR}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/><text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmtCompact(t)}</text>`).join('')}
    <path d="${area}" fill="${color}" opacity="0.10"/>
    <path d="${path}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}${labels}
    ${points.map((p, i) => `<text x="${x(i).toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="12" fill="${MUTED}">${esc(p.label)}</text>`).join('')}
  </svg>`;
}

// Vertical bar chart: bars is [{label, value, color?}].
export function barChart(bars, { height = 230, valueLabel = (v) => fmt(v, 1), yLabel = '' } = {}) {
  const w = 640;
  const h = height;
  const padL = 52;
  const padR = 14;
  const padT = 26;
  const padB = 30;
  const values = bars.map((b) => b.value);
  const max = Math.max(...values, 0) * 1.12;
  const min = Math.min(0, ...values) * 1.12;
  const ticks = niceTicks(min, max, 4);
  const top = Math.max(max, ticks[ticks.length - 1]);
  const bottom = Math.min(min, ticks[0]);
  const y = (v) => padT + ((h - padT - padB) * (top - v)) / (top - bottom);
  const slot = (w - padL - padR) / bars.length;
  const bw = Math.min(56, slot * 0.58);
  const zeroY = y(0);
  const rects = bars
    .map((b, i) => {
      const cx = padL + slot * i + slot / 2;
      const by = b.value >= 0 ? y(b.value) : zeroY;
      const bh = Math.abs(y(b.value) - zeroY);
      return `<rect x="${(cx - bw / 2).toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(bh, 1).toFixed(1)}" rx="4" fill="${b.color || (b.value < 0 ? AMBER : TEAL)}"><title>${esc(b.label)}: ${esc(valueLabel(b.value))}</title></rect>
      <text x="${cx.toFixed(1)}" y="${(by - 7).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${esc(valueLabel(b.value))}</text>
      <text x="${cx.toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="12" fill="${MUTED}">${esc(b.label)}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafik batang ${esc(yLabel)}" class="chart">
    ${ticks.map((t) => `<line x1="${padL}" y1="${y(t)}" x2="${w - padR}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/><text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmtCompact(t)}</text>`).join('')}
    <line x1="${padL}" y1="${zeroY}" x2="${w - padR}" y2="${zeroY}" stroke="${MUTED}" stroke-width="1"/>
    ${rects}
  </svg>`;
}

// Horizontal bar chart: rows is [{label, value, note?}]; good for rankings.
export function hbarChart(rows, { valueLabel = (v) => fmt(v, 1), maxLabel = 34 } = {}) {
  const w = 640;
  const rowH = 34;
  const padL = 132;
  const padR = 64;
  const h = rows.length * rowH + 14;
  const max = Math.max(...rows.map((r) => r.value)) * 1.05;
  const body = rows
    .map((r, i) => {
      const y = 8 + i * rowH;
      const bw = ((w - padL - padR) * r.value) / max;
      const label = r.label.length > maxLabel ? r.label.slice(0, maxLabel - 1) + '…' : r.label;
      return `<text x="${padL - 10}" y="${y + 19}" text-anchor="end" font-size="13" fill="${INK}">${esc(label)}</text>
      <rect x="${padL}" y="${y + 4}" width="${bw.toFixed(1)}" height="18" rx="4" fill="${r.color || TEAL}"><title>${esc(r.label)}: ${esc(valueLabel(r.value))}</title></rect>
      <text x="${padL + bw + 8}" y="${y + 19}" font-size="13" font-weight="700" fill="${INK}">${esc(valueLabel(r.value))}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Grafik batang horizontal" class="chart">${body}</svg>`;
}

// Donut chart: slices is [{label, value, color}]; centre shows the first slice.
export function donutChart(slices, { size = 260, centre = '' } = {}) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const r = 96;
  const cx = size / 2;
  const cy = size / 2;
  let angle = -Math.PI / 2;
  const paths = slices
    .map((s) => {
      const frac = s.value / total;
      const a0 = angle;
      const a1 = angle + frac * Math.PI * 2;
      angle = a1;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      return `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${s.color}"><title>${esc(s.label)}: ${fmt(s.value / total * 100, 1)}%</title></path>`;
    })
    .join('');
  const legend = slices
    .map((s) => `<span class="legend-item"><span class="legend-swatch" style="background:${s.color}"></span>${esc(s.label)} — <strong>${fmt((s.value / total) * 100, 1)}%</strong></span>`)
    .join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Grafik donat" class="donut">
    ${paths}<circle cx="${cx}" cy="${cy}" r="58" fill="#fff"/>
    <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="21" font-weight="800" fill="${INK}">${esc(centre)}</text>
    <text x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="12" fill="${MUTED}">dari penduduk bekerja</text>
  </svg><div class="legend">${legend}</div></div>`;
}

export { SAND, TEAL, AMBER };
