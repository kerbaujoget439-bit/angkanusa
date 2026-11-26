// AngkaNusa — data.js
//
// Every figure on this site lives here, with its source and year.
// All figures are official 2024 releases (BPS unless stated otherwise),
// checked against the publishing release before they were written in.
// Nothing here is estimated by this site except the two figures marked
// "dihitung" (computed from two published figures shown beside them).

export const SOURCES = [
  { id: 'bps', name: 'Badan Pusat Statistik (BPS)', note: 'Sensus Penduduk 2020, proyeksi penduduk, Berita Resmi Statistik 2024–2025', year: 2024 },
  { id: 'bps-sakernas', name: 'BPS — Sakernas Agustus 2024', note: 'Survei Angkatan Kerja Nasional, Booklet Sakernas Agustus 2024', year: 2024 },
  { id: 'bps-susenas', name: 'BPS — Susenas 2024', note: 'Survei Sosial Ekonomi Nasional 2024', year: 2024 },
  { id: 'kemenkes', name: 'Kementerian Kesehatan — SSGI 2024', note: 'Survei Status Gizi Indonesia 2024, diumumkan Mei 2025', year: 2024 },
  { id: 'apjii', name: 'APJII — Survei Penetrasi Internet 2024', note: 'Asosiasi Penyelenggara Jasa Internet Indonesia', year: 2024 },
  { id: 'bi', name: 'Bank Indonesia', note: 'Siaran pers inflasi & neraca perdagangan, Januari 2025', year: 2024 },
  { id: 'dukcapil', name: 'Ditjen Dukcapil Kemendagri', note: 'Data Kependudukan Bersih Semester I 2024', year: 2024 },
  { id: 'wb', name: 'Bank Dunia — WDI', note: 'World Development Indicators, PDB per kapita PPP', year: 2024 },
];

export const DATA = {
  updated: 'Angka tahun 2024, dirilis 2024–2025',
  country: 'Indonesia',
  population: {
    total: 281.6, unit: 'juta jiwa', year: 2024, source: 'bps',
    note: 'Pertengahan tahun 2024; negara berpenduduk terbesar ke-4 di dunia.',
    series: [
      { year: 2020, value: 270.2 },
      { year: 2021, value: 272.68 },
      { year: 2022, value: 275.77 },
      { year: 2023, value: 278.7 },
      { year: 2024, value: 281.6 },
    ],
    growth: { value: 1.04, unit: '% per tahun', year: 2024, source: 'bps', note: 'Dihitung dari 278,70 juta (2023) menjadi 281,60 juta (2024).' },
    maleShare: { value: 50.58, unit: '%', year: 2020, source: 'bps', note: 'Sensus Penduduk 2020: 136,66 juta laki-laki, 133,54 juta perempuan.' },
    density: { value: 149, unit: 'jiwa/km²', year: 2024, source: 'bps', note: 'Dihitung: 281,6 juta jiwa dibagi luas daratan 1.890.180 km² (BPS).' },
    landArea: { value: 1890180, unit: 'km²', year: 2024, source: 'bps' },
    islands: { value: 17380, unit: 'pulau', year: 2024, source: 'bps' },
    languages: { value: 718, unit: 'bahasa daerah', year: 2024, source: 'bps' },
    provinces: { value: 38, unit: 'provinsi', year: 2024, source: 'bps' },
    javaShare: { value: 55.93, unit: '% penduduk di Pulau Jawa', year: 2024, source: 'dukcapil' },
    sumatraShare: { value: 21.81, unit: '% penduduk di Pulau Sumatera', year: 2024, source: 'dukcapil' },
    topProvinces: [
      { name: 'Jawa Barat', pop: 50.3452, share: 17.9 },
      { name: 'Jawa Timur', pop: 41.8145, share: 14.8 },
      { name: 'Jawa Tengah', pop: 37.8923, share: 13.5 },
      { name: 'Sumatera Utara', pop: 15.5885, share: 5.5 },
      { name: 'Banten', pop: 12.4314, share: 4.4 },
      { name: 'DKI Jakarta', pop: 10.6849, share: 3.8 },
      { name: 'Sulawesi Selatan', pop: 9.4634, share: 3.4 },
    ],
  },
  economy: {
    gdp: { value: 22139, unit: 'Rp triliun', year: 2024, source: 'bps', note: 'Atas dasar harga berlaku.' },
    growth: {
      value: 5.03, unit: '% (yoy)', year: 2024, source: 'bps',
      series: [
        { year: 2020, value: -2.07 },
        { year: 2021, value: 3.7 },
        { year: 2022, value: 5.31 },
        { year: 2023, value: 5.05 },
        { year: 2024, value: 5.03 },
      ],
    },
    gdpPerCapita: { value: 78.62, unit: 'Rp juta', year: 2024, source: 'bps', note: 'Setara US$4.960,33.' },
    gdpPerCapitaPPP: { value: 16515, unit: 'US$ (PPP)', year: 2024, source: 'wb' },
    inflation: {
      value: 1.57, unit: '% (yoy, Desember)', year: 2024, source: 'bps',
      core: 2.26, cpi: 106.8,
      series: [
        { year: 2020, value: 1.68 },
        { year: 2021, value: 1.87 },
        { year: 2022, value: 5.51 },
        { year: 2023, value: 2.61 },
        { year: 2024, value: 1.57 },
      ],
    },
    trade: {
      year: 2024, source: 'bps',
      series: [
        { year: 2021, exports: 231.61, imports: 196.27, surplus: 35.34 },
        { year: 2022, exports: 291.9, imports: 237.44, surplus: 54.46 },
        { year: 2023, exports: 258.82, imports: 221.93, surplus: 36.89 },
        { year: 2024, exports: 264.7, imports: 233.66, surplus: 31.04 },
      ],
      streak: { value: 56, unit: 'bulan surplus beruntun sejak Mei 2020', year: 2024, source: 'bi' },
    },
  },
  employment: {
    workingAge: { value: 215.37, unit: 'juta orang (15+)', year: 2024, source: 'bps-sakernas' },
    labourForce: { value: 152.11, unit: 'juta orang', year: 2024, source: 'bps-sakernas' },
    tpAk: { value: 70.63, unit: '%', year: 2024, source: 'bps-sakernas', note: 'Tingkat Partisipasi Angkatan Kerja, Agustus 2024.' },
    employed: { value: 144.64, unit: 'juta orang', year: 2024, source: 'bps-sakernas' },
    unemployed: { value: 7.47, unit: 'juta orang', year: 2024, source: 'bps-sakernas' },
    tpt: {
      value: 4.91, unit: '%', year: 2024, source: 'bps-sakernas',
      note: 'Tingkat Pengangguran Terbuka, Agustus 2024. Laki-laki 4,90%, perempuan 4,92%; perkotaan 5,79%, perdesaan 3,67%.',
      series: [
        { year: 2020, value: 7.07 },
        { year: 2021, value: 6.49 },
        { year: 2022, value: 5.86 },
        { year: 2023, value: 5.32 },
        { year: 2024, value: 4.91 },
      ],
    },
    formal: { value: 60.81, unit: 'juta orang (42,05%)', year: 2024, source: 'bps-sakernas' },
    informal: { value: 83.83, unit: 'juta orang (57,95%)', year: 2024, source: 'bps-sakernas', note: 'Dihitung: 144,64 juta bekerja dikurangi 60,81 juta formal.' },
    agricultureShare: { value: 28.18, unit: '% penduduk bekerja', year: 2024, source: 'bps-sakernas', note: 'Sektor pertanian menyerap pekerja terbanyak.' },
    employees: { value: 38.8, unit: '% penduduk bekerja', year: 2024, source: 'bps-sakernas', note: 'Status buruh/karyawan/pegawai.' },
    ownAccount: { value: 21.78, unit: '% penduduk bekerja', year: 2024, source: 'bps-sakernas', note: 'Status berusaha sendiri.' },
    fullTime: { value: 98.45, unit: 'juta orang', year: 2024, source: 'bps-sakernas' },
    partTime: { value: 34.63, unit: 'juta orang', year: 2024, source: 'bps-sakernas' },
  },
  health: {
    lifeExpectancy: { value: 74.15, unit: 'tahun', year: 2024, source: 'bps', note: 'Umur harapan hidup saat lahir.' },
    hdi: {
      value: 75.02, unit: 'poin (kategori Tinggi)', year: 2024, source: 'bps',
      series: [
        { year: 2022, value: 73.77 },
        { year: 2023, value: 74.39 },
        { year: 2024, value: 75.02 },
      ],
    },
    hls: { value: 13.21, unit: 'tahun', year: 2024, source: 'bps', note: 'Harapan lama sekolah.' },
    rls: { value: 8.85, unit: 'tahun', year: 2024, source: 'bps', note: 'Rata-rata lama sekolah penduduk 25 tahun ke atas.' },
    expenditure: { value: 12.34, unit: 'Rp juta/tahun', year: 2024, source: 'bps', note: 'Pengeluaran riil per kapita per tahun (disesuaikan).' },
    hdiHighest: { name: 'DKI Jakarta', value: 84.15, year: 2024, source: 'bps' },
    hdiLowest: { name: 'Papua Pegunungan', value: 54.43, year: 2024, source: 'bps' },
    hdiDiy: { name: 'DI Yogyakarta', value: 81.62, year: 2024, source: 'bps' },
    stunting: {
      value: 19.8, unit: '% balita', year: 2024, source: 'kemenkes',
      note: 'Pertama kali di bawah 20%. 2022: 21,6%; 2023: 21,5%.',
      series: [
        { year: 2013, value: 37.6 },
        { year: 2022, value: 21.6 },
        { year: 2023, value: 21.5 },
        { year: 2024, value: 19.8 },
      ],
    },
    wasting: { value: 7.4, unit: '% balita', year: 2024, source: 'kemenkes' },
    overweight: { value: 3.4, unit: '% balita', year: 2024, source: 'kemenkes' },
    extremePoverty: { value: 0.83, unit: '%', year: 2024, source: 'bps', note: 'Kemiskinan ekstrem; 2023: 1,12%.' },
  },
  education: {
    hls: { value: 13.21, unit: 'tahun', year: 2024, source: 'bps', note: '2020: 12,98 tahun.' },
    rls: { value: 8.85, unit: 'tahun', year: 2024, source: 'bps', note: '2020: 8,48 tahun. Setara kelas 3 SMP.' },
    aps: [
      { group: 'Usia 7–12 tahun (SD)', value: 99.19 },
      { group: 'Usia 13–15 tahun (SMP)', value: 96.17 },
      { group: 'Usia 16–18 tahun (SMA)', value: 74.64 },
      { group: 'Usia 19–23 tahun (PT)', value: 29.01 },
    ],
    apsYear: 2024, apsSource: 'bps-susenas',
    hlsHighest: { name: 'DI Yogyakarta', value: 15.7, year: 2024, source: 'bps' },
    hlsLowest: { name: 'Papua Tengah', value: 9.63, year: 2024, source: 'bps' },
    hlsLowest2: { name: 'Papua Pegunungan', value: 9.97, year: 2024, source: 'bps' },
  },
  poverty: {
    rate: { value: 8.57, unit: '%', year: 2024, source: 'bps', note: 'September 2024 — terendah sepanjang sejarah pencatatan. 24,06 juta orang.' },
    count: { value: 24.06, unit: 'juta orang', year: 2024, source: 'bps' },
    urban: { value: 6.66, unit: '%', year: 2024, source: 'bps' },
    rural: { value: 11.34, unit: '%', year: 2024, source: 'bps' },
    line: { value: 595242, unit: 'Rp/kapita/bulan', year: 2024, source: 'bps', note: 'Garis kemiskinan, September 2024.' },
    seriesMar: [
      { year: 2020, value: 9.78 },
      { year: 2021, value: 10.14 },
      { year: 2022, value: 9.54 },
      { year: 2023, value: 9.36 },
      { year: 2024, value: 9.03 },
    ],
    gini: { value: 0.381, unit: 'rasio (September)', year: 2024, source: 'bps', note: 'Maret 2024: 0,379; Maret 2023: 0,388. Perkotaan 0,402; perdesaan 0,308.' },
    highestProvinces: [
      { name: 'Papua Pegunungan', value: 29.66 },
      { name: 'Papua Tengah', value: 27.6 },
      { name: 'Papua Barat', value: 21.09 },
    ],
  },
  digital: {
    internetUsers: { value: 221.56, unit: 'juta orang', year: 2024, source: 'apjii' },
    internetPenetration: { value: 79.5, unit: '% penduduk', year: 2024, source: 'apjii', note: '2023: 215,6 juta orang (78,19%).' },
  },
};

// The routes of the site, in nav order. Each route has a renderer in views.js.
export const ROUTES = [
  { hash: '#/', label: 'Ringkasan' },
  { hash: '#/penduduk', label: 'Penduduk' },
  { hash: '#/ekonomi', label: 'Ekonomi' },
  { hash: '#/kerja', label: 'Ketenagakerjaan' },
  { hash: '#/kesehatan', label: 'Kesehatan' },
  { hash: '#/pendidikan', label: 'Pendidikan' },
  { hash: '#/daerah', label: 'Daerah' },
  { hash: '#/sumber', label: 'Sumber Data' },
];

export function sourceById(id) {
  return SOURCES.find((s) => s.id === id) || SOURCES[0];
}
