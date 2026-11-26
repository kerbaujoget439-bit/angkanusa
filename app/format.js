// AngkaNusa — format.js
//
// Small number-formatting helpers, one job: turn raw figures into the
// Indonesian-locale strings the pages show (comma decimals, dot thousands).

export function fmt(value, decimals = 2) {
  return Number(value).toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtInt(value) {
  return Number(value).toLocaleString('id-ID', { maximumFractionDigits: 0 });
}

export function fmtCompact(value) {
  // Short form for axis labels: 50,3 jt — value already in millions.
  return fmt(value, 1).replace(',0', '');
}

export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
