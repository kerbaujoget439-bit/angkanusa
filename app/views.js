// AngkaNusa — views.js
//
// One renderer per route. Each renderer returns an HTML string for the
// #page mount point: a heading, KPI cards, chart cards (each with a source
// line and a "Lihat data" table toggle), and the facts a visitor came for.
// All behaviour (tabs, table toggles, search, sort) is wired in main.js.

import { DATA, SOURCES, sourceById } from './data.js';
import { lineChart, barChart, hbarChart, donutChart, TEAL, AMBER } from './charts.js';
import { fmt, fmtInt, esc } from './format.js';

function srcTag(sourceId, year) {
  const s = sourceById(sourceId);
  return `<p class="src">Sumber: ${esc(s.name)}, ${year}.</p>`;
}

function kpi(label, value, unit, sourceId, year, note = '') {
  return `<article class="kpi"><p class="kpi-label">${esc(label)}</p>
    <p class="kpi-value">${value}</p><p class="kpi-unit">${esc(unit)}</p>
    <p class="kpi-src">${esc(sourceById(sourceId).name)} · ${year}</p>
    ${note ? `<p class="kpi-note">${esc(note)}</p>` : ''}</article>`;
}

function chartCard(id, title, chartHtml, sourceId, year, tableHtml, blurb = '') {
  return `<section class="card chart-card" aria-label="${esc(title)}">
    <h3>${esc(title)}</h3>${blurb ? `<p class="blurb">${esc(blurb)}</p>` : ''}
    ${chartHtml}
    <button class="table-toggle" type="button" data-table-toggle="${id}" aria-expanded="false">Lihat data sebagai tabel</button>
    <div class="data-table" id="table-${id}" hidden>${tableHtml}</div>
    ${srcTag(sourceId, year)}
  </section>`;
}

function dataTable(headers, rows) {
  const th = headers.map((h) => `<th scope="col">${esc(h)}</th>`).join('');
  const tr = rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}

function sectionHead(eyebrow, title, intro) {
  return `<p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2><p class="intro">${esc(intro)}</p>`;
}

function exploreLinks(current) {
  const links = [
    ['#/penduduk', 'Penduduk', '281,6 juta jiwa dan sebarannya'],
    ['#/ekonomi', 'Ekonomi', 'PDB Rp22.139 triliun, tumbuh 5,03%'],
    ['#/kerja', 'Ketenagakerjaan', 'Pengangguran 4,91%, 152,11 juta angkatan kerja'],
    ['#/kesehatan', 'Kesehatan', 'Harapan hidup 74,15 tahun, IPM 75,02'],
    ['#/pendidikan', 'Pendidikan', 'Harapan lama sekolah 13,21 tahun'],
    ['#/daerah', 'Daerah', 'Jawa Barat 50,35 juta jiwa — provinsi terpadat'],
  ].filter(([h]) => h !== current);
  return `<section class="explore"><h3>Jelajahi angka Indonesia</h3><div class="explore-grid">${links
    .map(([h, t, d]) => `<a class="explore-card" href="${h}"><strong>${esc(t)}</strong><span>${esc(d)}</span></a>`)
    .join('')}</div></section>`;
}

export function viewOverview() {
  const p = DATA.population;
  const e = DATA.economy;
  const pov = DATA.poverty;
  return `
  <header class="hero">
    <p class="eyebrow">Statistik Nasional · Edisi 2024</p>
    <h1>Indonesia dalam angka</h1>
    <p class="lede">Satu tempat untuk angka resmi Indonesia: penduduk, ekonomi,
    pekerjaan, kesehatan, dan pendidikan — masing-masing dengan sumber dan
    tahunnya, diperbarui dari rilis resmi 2024.</p>
  </header>
  <section class="kpi-grid" aria-label="Angka kunci">
    ${kpi('Penduduk', fmt(p.total, 1), 'juta jiwa', 'bps', 2024, 'Pertengahan 2024')}
    ${kpi('PDB', 'Rp' + fmt(e.gdp.value, 0), 'triliun', 'bps', 2024, 'Tumbuh ' + fmt(e.growth.value, 2) + '%')}
    ${kpi('PDB per kapita', 'Rp' + fmt(e.gdpPerCapita.value, 2), 'juta', 'bps', 2024, '≈ US$4.960')}
    ${kpi('Pengangguran', fmt(DATA.employment.tpt.value, 2) + '%', 'Agustus 2024', 'bps-sakernas', 2024, '7,47 juta orang')}
    ${kpi('Kemiskinan', fmt(pov.rate.value, 2) + '%', 'September 2024', 'bps', 2024, 'Terendah sepanjang sejarah')}
    ${kpi('IPM', fmt(DATA.health.hdi.value, 2), 'kategori Tinggi', 'bps', 2024, 'Harapan hidup 74,15 thn')}
  </section>
  <div class="grid-2">
    ${chartCard('pop', 'Penduduk terus bertambah', lineChart(p.series.map((s) => ({ label: String(s.year), value: s.value })), { valueLabel: (v) => fmt(v, 1), yLabel: 'juta jiwa' }), 'bps', 2024, dataTable(['Tahun', 'Penduduk (juta jiwa)'], p.series.map((s) => [String(s.year), fmt(s.value, 2)])), 'Pertengahan tahun, 2020–2024. Dalam empat tahun penduduk bertambah 11,4 juta jiwa.')}
    ${chartCard('gdp', 'Pertumbuhan ekonomi kembali ke 5%', barChart(e.growth.series.map((s) => ({ label: String(s.year), value: s.value, color: s.value < 0 ? AMBER : TEAL })), { valueLabel: (v) => fmt(v, 2) + '%', yLabel: 'pertumbuhan PDB (%)' }), 'bps', 2024, dataTable(['Tahun', 'Pertumbuhan PDB (%)'], e.growth.series.map((s) => [String(s.year), fmt(s.value, 2)])), 'Setelah kontraksi −2,07% pada 2020, ekonomi tumbuh di atas 5% tiga tahun beruntun.')}
  </div>
  <div class="grid-2">
    ${chartCard('pov', 'Kemiskinan turun ke titik terendah', lineChart(pov.seriesMar.map((s) => ({ label: String(s.year), value: s.value })), { color: AMBER, valueLabel: (v) => fmt(v, 2) + '%', yLabel: 'penduduk miskin (%)' }), 'bps', 2024, dataTable(['Tahun (Maret)', 'Penduduk miskin (%)'], pov.seriesMar.map((s) => [String(s.year), fmt(s.value, 2)])), 'Persentase Maret tiap tahun. Pada September 2024 angkanya 8,57% — 24,06 juta orang.')}
    ${chartCard('prov', 'Tiga provinsi menampung hampir setengah penduduk', hbarChart(p.topProvinces.slice(0, 5).map((t) => ({ label: t.name, value: t.pop })), { valueLabel: (v) => fmt(v, 1) + ' jt' }), 'bps', 2024, dataTable(['Provinsi', 'Penduduk (juta jiwa)', 'Pangsa'], p.topProvinces.map((t) => [esc(t.name), fmt(t.pop, 2), fmt(t.share, 1) + '%'])), 'Jawa Barat, Jawa Timur, dan Jawa Tengah saja menampung 46,2% penduduk Indonesia.')}
  </div>
  <section class="note-strip"><strong>Yang perlu diketahui:</strong> 55,93% penduduk tinggal di Pulau Jawa
  (Ditjen Dukcapil, 2024), sementara 38 provinsi membentang dari Aceh sampai Papua Pegunungan.
  Semua angka di situs ini mencantumkan sumber dan tahunnya — lihat <a href="#/sumber">Sumber Data</a>.</section>
  ${exploreLinks('#/')}`;
}

export function viewPopulation() {
  const p = DATA.population;
  return `
  ${sectionHead('Penduduk', '281,6 juta jiwa, tersebar di 17.380 pulau', 'Penduduk Indonesia pertengahan 2024 menurut Badan Pusat Statistik — jumlah, pertumbuhan, kepadatan, dan sebaran antarprovinsi.')}
  <section class="kpi-grid">
    ${kpi('Penduduk', fmt(p.total, 1), 'juta jiwa', 'bps', 2024, 'Terbesar ke-4 di dunia')}
    ${kpi('Pertumbuhan', '+' + fmt(p.growth.value, 2) + '%', 'per tahun', 'bps', 2024, 'Dihitung dari 2023')}
    ${kpi('Kepadatan', fmtInt(p.density.value), 'jiwa per km²', 'bps', 2024, 'Luas daratan 1.890.180 km²')}
    ${kpi('Pulau Jawa', fmt(p.javaShare.value, 2) + '%', 'penduduk', 'dukcapil', 2024, 'Pulau Sumatera 21,81%')}
    ${kpi('Laki-laki', fmt(p.maleShare.value, 2) + '%', 'penduduk', 'bps', 2020, 'Sensus 2020')}
    ${kpi('Bahasa daerah', fmtInt(p.languages.value), 'bahasa', 'bps', 2024, 'Di 38 provinsi')}
  </section>
  <div class="grid-2">
    ${chartCard('pop2', 'Pertumbuhan penduduk 2020–2024', lineChart(p.series.map((s) => ({ label: String(s.year), value: s.value })), { valueLabel: (v) => fmt(v, 1), yLabel: 'juta jiwa' }), 'bps', 2024, dataTable(['Tahun', 'Penduduk (juta jiwa)'], p.series.map((s) => [String(s.year), fmt(s.value, 2)])), 'Pertambahan 2023–2024: 2,91 juta jiwa (+1,04%).')}
    ${chartCard('prov2', 'Provinsi terpadat 2024', hbarChart(p.topProvinces.map((t) => ({ label: t.name, value: t.pop })), { valueLabel: (v) => fmt(v, 2) + ' jt' }), 'bps', 2024, dataTable(['Provinsi', 'Penduduk (juta jiwa)', 'Pangsa'], p.topProvinces.map((t) => [esc(t.name), fmt(t.pop, 2), fmt(t.share, 1) + '%'])), 'Tujuh provinsi teratas menampung 63,6% penduduk nasional.')}
  </div>
  <section class="card"><h3>Tabel: tujuh provinsi terpadat</h3>
  ${dataTable(['#', 'Provinsi', 'Penduduk (jiwa)', 'Pangsa nasional'], p.topProvinces.map((t, i) => [String(i + 1), esc(t.name), fmtInt(t.pop * 1000000), fmt(t.share, 1) + '%']))}
  ${srcTag('bps', 2024)}</section>
  ${exploreLinks('#/penduduk')}`;
}

export function viewEconomy() {
  const e = DATA.economy;
  const tabs = `
  <div class="tabs" role="tablist" aria-label="Pilih grafik ekonomi">
    <button type="button" role="tab" data-tab="growth" aria-selected="true">Pertumbuhan PDB</button>
    <button type="button" role="tab" data-tab="inflation" aria-selected="false">Inflasi</button>
    <button type="button" role="tab" data-tab="trade" aria-selected="false">Perdagangan</button>
  </div>
  <div class="tab-panel" data-panel="growth">
    ${chartCard('growth', 'Pertumbuhan PDB 2020–2024', barChart(e.growth.series.map((s) => ({ label: String(s.year), value: s.value, color: s.value < 0 ? AMBER : TEAL })), { valueLabel: (v) => fmt(v, 2) + '%' }), 'bps', 2024, dataTable(['Tahun', 'Pertumbuhan PDB (%)'], e.growth.series.map((s) => [String(s.year), fmt(s.value, 2)])), '2024: 5,03% — sedikit melambat dari 5,05% pada 2023.')}
  </div>
  <div class="tab-panel" data-panel="inflation" hidden>
    ${chartCard('infl', 'Inflasi tahunan 2020–2024', lineChart(e.inflation.series.map((s) => ({ label: String(s.year), value: s.value })), { color: AMBER, valueLabel: (v) => fmt(v, 2) + '%' }), 'bps', 2024, dataTable(['Tahun', 'Inflasi (% yoy, Desember)'], e.inflation.series.map((s) => [String(s.year), fmt(s.value, 2)])), 'Desember 2024: 1,57% (yoy), inflasi inti 2,26%, IHK 106,80 — dalam sasaran 2,5% ± 1%.')}
  </div>
  <div class="tab-panel" data-panel="trade" hidden>
    ${chartCard('trade', 'Ekspor, impor, dan surplus 2021–2024', barChart(e.trade.series.map((s) => ({ label: String(s.year), value: s.exports })), { valueLabel: (v) => 'US$' + fmt(v, 1) + ' M' }), 'bps', 2024, dataTable(['Tahun', 'Ekspor (US$ M)', 'Impor (US$ M)', 'Surplus (US$ M)'], e.trade.series.map((s) => [String(s.year), fmt(s.exports, 2), fmt(s.imports, 2), fmt(s.surplus, 2)])), 'Batang menunjukkan ekspor. Surplus 2024: US$31,04 miliar — bulan surplus ke-56 beruntun sejak Mei 2020.')}
  </div>`;
  return `
  ${sectionHead('Ekonomi', 'PDB Rp22.139 triliun, tumbuh 5,03%', 'Ekonomi Indonesia 2024 menurut BPS: produk domestik bruto, inflasi, dan perdagangan luar negeri.')}
  <section class="kpi-grid">
    ${kpi('PDB', 'Rp' + fmt(e.gdp.value, 0), 'triliun', 'bps', 2024, 'Harga berlaku')}
    ${kpi('Pertumbuhan', fmt(e.growth.value, 2) + '%', 'yoy', 'bps', 2024, '2023: 5,05%')}
    ${kpi('PDB per kapita', 'Rp' + fmt(e.gdpPerCapita.value, 2), 'juta', 'bps', 2024, '≈ US$4.960')}
    ${kpi('PDB per kapita (PPP)', 'US$' + fmtInt(e.gdpPerCapitaPPP.value), '', 'wb', 2024, 'Daya beli')}
    ${kpi('Inflasi', fmt(e.inflation.value, 2) + '%', 'yoy, Des 2024', 'bps', 2024, '2023: 2,61%')}
    ${kpi('Surplus dagang', 'US$' + fmt(e.trade.series[3].surplus, 2), 'miliar', 'bps', 2024, 'Ekspor US$264,70 M')}
  </section>
  ${tabs}
  <section class="card"><h3>Neraca perdagangan 2021–2024 (US$ miliar)</h3>
  ${dataTable(['Tahun', 'Ekspor', 'Impor', 'Surplus'], e.trade.series.map((s) => [String(s.year), fmt(s.exports, 2), fmt(s.imports, 2), fmt(s.surplus, 2)]))}
  ${srcTag('bps', 2024)}
  <p class="blurb">Tujuan ekspor nonmigas terbesar 2024: Tiongkok, Amerika Serikat, dan Jepang. Impor didominasi bahan baku/penolong dan barang modal (90,28% dari total impor).</p></section>
  ${exploreLinks('#/ekonomi')}`;
}

export function viewEmployment() {
  const w = DATA.employment;
  return `
  ${sectionHead('Ketenagakerjaan', '152,11 juta orang dalam angkatan kerja', 'Pasar kerja Indonesia Agustus 2024 menurut Sakernas BPS: siapa bekerja, siapa menganggur, dan di mana mereka bekerja.')}
  <section class="kpi-grid">
    ${kpi('Angkatan kerja', fmt(w.labourForce.value, 2), 'juta orang', 'bps-sakernas', 2024, 'TPAK 70,63%')}
    ${kpi('Bekerja', fmt(w.employed.value, 2), 'juta orang', 'bps-sakernas', 2024, 'Penuh waktu 98,45 jt')}
    ${kpi('Pengangguran', fmt(w.tpt.value, 2) + '%', 'TPT, Agustus', 'bps-sakernas', 2024, '7,47 juta orang')}
    ${kpi('Penduduk usia kerja', fmt(w.workingAge.value, 2), 'juta (15+)', 'bps-sakernas', 2024, 'Bukan angkatan kerja 63,26 jt')}
    ${kpi('Pekerja informal', fmt(w.informal.value, 0), 'juta orang', 'bps-sakernas', 2024, '57,95% yang bekerja')}
    ${kpi('Pertanian', fmt(w.agricultureShare.value, 2) + '%', 'pekerja', 'bps-sakernas', 2024, 'Sektor penyerap terbesar')}
  </section>
  <div class="grid-2">
    ${chartCard('tpt', 'Pengangguran turun lima tahun beruntun', lineChart(w.tpt.series.map((s) => ({ label: String(s.year), value: s.value })), { valueLabel: (v) => fmt(v, 2) + '%', yLabel: 'TPT (%)' }), 'bps-sakernas', 2024, dataTable(['Tahun (Agustus)', 'TPT (%)'], w.tpt.series.map((s) => [String(s.year), fmt(s.value, 2)])), 'Dari puncak pandemi 7,07% (2020) ke 4,91% (2024) — di bawah level pra-pandemi 5,28% (2019).')}
    <section class="card chart-card"><h3>Formal vs informal</h3>
    <p class="blurb">Dari 144,64 juta penduduk bekerja, Agustus 2024.</p>
    ${donutChart([{ label: 'Informal', value: 83.83, color: AMBER }, { label: 'Formal', value: 60.81, color: TEAL }], { centre: '57,95%' })}
    ${srcTag('bps-sakernas', 2024)}
    <p class="blurb">Formal 60,81 juta orang (42,05%); informal 83,83 juta orang (57,95%).</p></section>
  </div>
  <section class="card"><h3>Status pekerjaan utama</h3>
  ${dataTable(['Status', 'Pangsa penduduk bekerja'], [['Buruh/karyawan/pegawai', fmt(w.employees.value, 2) + '%'], ['Berusaha sendiri', fmt(w.ownAccount.value, 2) + '%'], ['Pekerja penuh waktu', fmt(w.fullTime.value, 2) + ' juta orang'], ['Pekerja paruh waktu', fmt(w.partTime.value, 2) + ' juta orang']])}
  ${srcTag('bps-sakernas', 2024)}</section>
  ${exploreLinks('#/kerja')}`;
}

export function viewHealth() {
  const h = DATA.health;
  return `
  ${sectionHead('Kesehatan', 'Harapan hidup 74,15 tahun dan terus naik', 'Kesehatan Indonesia 2024 menurut BPS dan Kementerian Kesehatan: umur panjang, pembangunan manusia, dan gizi balita.')}
  <section class="kpi-grid">
    ${kpi('Harapan hidup', fmt(h.lifeExpectancy.value, 2), 'tahun', 'bps', 2024, 'Saat lahir')}
    ${kpi('IPM', fmt(h.hdi.value, 2), 'kategori Tinggi', 'bps', 2024, '2023: 74,39')}
    ${kpi('Stunting balita', fmt(h.stunting.value, 1) + '%', 'prevalensi', 'kemenkes', 2024, '2023: 21,5%')}
    ${kpi('Wasting', fmt(h.wasting.value, 1) + '%', 'balita', 'kemenkes', 2024, 'Gizi kurang akut')}
    ${kpi('Gizi lebih', fmt(h.overweight.value, 1) + '%', 'balita', 'kemenkes', 2024, 'Overweight')}
    ${kpi('Kemiskinan ekstrem', fmt(h.extremePoverty.value, 2) + '%', '', 'bps', 2024, '2023: 1,12%')}
  </section>
  <div class="grid-2">
    ${chartCard('hdi', 'IPM naik tiga tahun beruntun', lineChart(h.hdi.series.map((s) => ({ label: String(s.year), value: s.value })), { valueLabel: (v) => fmt(v, 2), yLabel: 'IPM' }), 'bps', 2024, dataTable(['Tahun', 'IPM'], h.hdi.series.map((s) => [String(s.year), fmt(s.value, 2)])), 'Komponen 2024: harapan lama sekolah 13,21 thn; rata-rata lama sekolah 8,85 thn; pengeluaran riil Rp12,34 jt/tahun.')}
    ${chartCard('stunt', 'Stunting turun di bawah 20% untuk pertama kali', barChart(h.stunting.series.map((s) => ({ label: String(s.year), value: s.value, color: s.year === 2013 ? AMBER : TEAL })), { valueLabel: (v) => fmt(v, 1) + '%' }), 'kemenkes', 2024, dataTable(['Tahun', 'Stunting (%)'], h.stunting.series.map((s) => [String(s.year), fmt(s.value, 1)])), 'Dari 37,6% pada 2013 menjadi 19,8% pada 2024 — target 2029: 14,2%.')}
  </div>
  <section class="card"><h3>IPM tertinggi dan terendah antarprovinsi, 2024</h3>
  ${dataTable(['Provinsi', 'IPM'], [[esc(h.hdiHighest.name), fmt(h.hdiHighest.value, 2)], [esc(h.hdiDiy.name), fmt(h.hdiDiy.value, 2)], [esc(h.hdiLowest.name), fmt(h.hdiLowest.value, 2)]])}
  ${srcTag('bps', 2024)}
  <p class="blurb">Rentang IPM 38 provinsi: 54,43–84,15; median 74,08.</p></section>
  ${exploreLinks('#/kesehatan')}`;
}

export function viewEducation() {
  const ed = DATA.education;
  return `
  ${sectionHead('Pendidikan', 'Anak Indonesia kini diharapkan sekolah 13,21 tahun', 'Pendidikan Indonesia 2024 menurut BPS: lama sekolah, partisipasi sekolah, dan kesenjangan antarprovinsi.')}
  <section class="kpi-grid">
    ${kpi('Harapan lama sekolah', fmt(ed.hls.value, 2), 'tahun', 'bps', 2024, '2020: 12,98 thn')}
    ${kpi('Rata-rata lama sekolah', fmt(ed.rls.value, 2), 'tahun', 'bps', 2024, 'Setara kelas 3 SMP')}
    ${kpi('Partisipasi SD', fmt(ed.aps[0].value, 2) + '%', 'usia 7–12 thn', 'bps-susenas', 2024, 'Hampir universal')}
    ${kpi('Partisipasi SMP', fmt(ed.aps[1].value, 2) + '%', 'usia 13–15 thn', 'bps-susenas', 2024, '')}
    ${kpi('Partisipasi SMA', fmt(ed.aps[2].value, 2) + '%', 'usia 16–18 thn', 'bps-susenas', 2024, 'Turun tajam setelah SMP')}
    ${kpi('Partisipasi PT', fmt(ed.aps[3].value, 2) + '%', 'usia 19–23 thn', 'bps-susenas', 2024, 'Perguruan tinggi')}
  </section>
  <div class="grid-2">
    ${chartCard('aps', 'Partisipasi sekolah menurut jenjang', hbarChart(ed.aps.map((a) => ({ label: a.group, value: a.value })), { valueLabel: (v) => fmt(v, 2) + '%' }), 'bps-susenas', 2024, dataTable(['Kelompok usia', 'APS (%)'], ed.aps.map((a) => [esc(a.group), fmt(a.value, 2)])), 'Angka Partisipasi Sekolah (APS) 2024: hampir semua anak usia SD bersekolah, tetapi hanya 3 dari 10 pemuda usia kuliah yang masih bersekolah.')}
    <section class="card chart-card"><h3>Kesenjangan harapan lama sekolah</h3>
    <p class="blurb">Harapan lama sekolah tertinggi dan terendah antarprovinsi, 2024.</p>
    ${dataTable(['Provinsi', 'HLS (tahun)'], [[esc(ed.hlsHighest.name), fmt(ed.hlsHighest.value, 1)], [esc(ed.hlsLowest2.name), fmt(ed.hlsLowest2.value, 2)], [esc(ed.hlsLowest.name), fmt(ed.hlsLowest.value, 2)]])}
    ${srcTag('bps', 2024)}
    <p class="blurb">Selisihnya 6 tahun sekolah: anak di DI Yogyakarta diharapkan bersekolah hingga 15,7 tahun, di Papua Tengah 9,63 tahun.</p></section>
  </div>
  ${exploreLinks('#/pendidikan')}`;
}

export function viewRegions() {
  const p = DATA.population;
  const pov = DATA.poverty;
  const h = DATA.health;
  const rows = p.topProvinces
    .map((t, i) => `<tr data-name="${esc(t.name.toLowerCase())}" data-pop="${t.pop}"><td>${i + 1}</td><td>${esc(t.name)}</td><td>${fmt(t.pop, 4)}</td><td>${fmt(t.share, 1)}%</td></tr>`)
    .join('');
  return `
  ${sectionHead('Daerah', 'Tujuh provinsi, dua pertiga penduduk', 'Penjelajah provinsi: cari dan urutkan provinsi terpadat Indonesia 2024, lalu bandingkan dengan angka kemiskinan dan IPM tertinggi.')}
  <section class="card">
    <h3>Provinsi terpadat 2024</h3>
    <div class="region-controls">
      <label>Cari provinsi <input id="prov-search" type="search" placeholder="Ketik nama provinsi…" autocomplete="off"></label>
      <label>Urutkan <select id="prov-sort"><option value="pop-desc">Penduduk terbanyak</option><option value="pop-asc">Penduduk tersedikit</option><option value="name">Nama A–Z</option></select></label>
    </div>
    <table id="prov-table"><thead><tr><th scope="col">#</th><th scope="col">Provinsi</th><th scope="col">Penduduk (juta jiwa)</th><th scope="col">Pangsa nasional</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="table-note" id="prov-count">Menampilkan 7 dari 7 provinsi.</p>
    ${srcTag('bps', 2024)}
  </section>
  <div class="grid-2">
    ${chartCard('prov3', 'Peta batang: tujuh provinsi terpadat', hbarChart(p.topProvinces.map((t) => ({ label: t.name, value: t.pop })), { valueLabel: (v) => fmt(v, 1) + ' jt' }), 'bps', 2024, dataTable(['Provinsi', 'Penduduk (juta jiwa)'], p.topProvinces.map((t) => [esc(t.name), fmt(t.pop, 2)])))}
    <section class="card chart-card"><h3>Ujung-ujung Indonesia</h3>
    <p class="blurb">Angka tertinggi dan terendah antarprovinsi, 2024.</p>
    ${dataTable(['Ukuran', 'Provinsi', 'Nilai'], [
      ['Kemiskinan tertinggi', esc(pov.highestProvinces[0].name), fmt(pov.highestProvinces[0].value, 2) + '%'],
      ['Kemiskinan tertinggi ke-2', esc(pov.highestProvinces[1].name), fmt(pov.highestProvinces[1].value, 2) + '%'],
      ['IPM tertinggi', esc(h.hdiHighest.name), fmt(h.hdiHighest.value, 2)],
      ['IPM terendah', esc(h.hdiLowest.name), fmt(h.hdiLowest.value, 2)],
      ['Penduduk terbanyak', 'Jawa Barat', fmt(p.topProvinces[0].pop, 2) + ' jt'],
    ])}
    ${srcTag('bps', 2024)}</section>
  </div>
  ${exploreLinks('#/daerah')}`;
}

export function viewSources() {
  const rows = SOURCES.map((s) => `<tr><td>${esc(s.name)}</td><td>${esc(s.note)}</td><td>${s.year}</td></tr>`).join('');
  return `
  ${sectionHead('Sumber Data', 'Dari mana angka-angka ini berasal', 'Setiap angka di AngkaNusa mencantumkan sumber dan tahunnya di tempat angka itu tampil. Di bawah ini daftar lengkap publikasi yang dipakai, dan cara angka-angka itu diperiksa.')}
  <section class="card"><h3>Publikasi sumber</h3>
  <table><thead><tr><th scope="col">Penerbit</th><th scope="col">Publikasi</th><th scope="col">Tahun data</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="blurb">Tautan luar tidak disertakan karena situs ini berjalan luring: cari nama publikasi di atas di situs resmi penerbitnya untuk memeriksa angka yang sama.</p></section>
  <section class="card"><h3>Metodologi & catatan</h3>
  <ul class="methods">
    <li><strong>Edisi data.</strong> Semua angka memakai rilis resmi terbaru yang tersedia saat situs dibuat: data tahun 2024, dirilis 2024–2025.</li>
    <li><strong>Periode pengukuran.</strong> Penduduk memakai pertengahan tahun; pengangguran memakai Agustus; kemiskinan memakai Maret dan September; inflasi memakai Desember.</li>
    <li><strong>Angka yang dihitung situs ini</strong> hanya dua: kepadatan penduduk (penduduk dibagi luas daratan) dan jumlah pekerja informal (bekerja dikurangi formal) — keduanya diberi label “Dihitung” di samping angkanya.</li>
    <li><strong>Pembulatan.</strong> Angka ditampilkan apa adanya dari rilis resmi; jumlah komponen yang dibulatkan bisa berbeda 0,01 dari totalnya.</li>
    <li><strong>Bukan situs resmi.</strong> AngkaNusa bukan Badan Pusat Statistik dan tidak berafiliasi dengannya; angka-angka di sini dikutip dari publikasi resmi untuk dibaca publik.</li>
  </ul></section>
  ${exploreLinks('#/sumber')}`;
}

export const VIEWS = {
  '/': viewOverview,
  '/penduduk': viewPopulation,
  '/ekonomi': viewEconomy,
  '/kerja': viewEmployment,
  '/kesehatan': viewHealth,
  '/pendidikan': viewEducation,
  '/daerah': viewRegions,
  '/sumber': viewSources,
};
