# AngkaNusa — Statistik Indonesia

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/kerbaujoget439-bit/angkanusa/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/kerbaujoget439-bit/angkanusa/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

**AngkaNusa** adalah situs statistik nasional Indonesia yang berjalan
sepenuhnya dari berkas statis, tanpa satu pun permintaan jaringan:
buka `app/index.html` di peramban desktop atau ponsel dan semua halaman,
grafik, dan tabel langsung bekerja.

Situs ini merangkum angka-angka resmi Indonesia tahun 2024 — penduduk,
ekonomi, ketenagakerjaan, kesehatan, pendidikan, dan perbandingan
antarprovinsi — masing-masing dengan sumber dan tahunnya. Setiap angka
yang ditampilkan berasal dari publikasi resmi (BPS, Kementerian
Kesehatan, APJII, Bank Indonesia) dan dicantumkan sumbernya di halaman
[Sumber Data](#/sumber).

## Halaman

| Rute | Isi |
| --- | --- |
| `#/` | Ringkasan: enam angka kunci, tren penduduk, pertumbuhan ekonomi, kemiskinan, provinsi terbesar |
| `#/penduduk` | Penduduk: jumlah, pertumbuhan, kepadatan, sebaran pulau, provinsi terpadat |
| `#/ekonomi` | Ekonomi: PDB, PDB per kapita, inflasi, ekspor-impor dan neraca perdagangan |
| `#/kerja` | Ketenagakerjaan: pengangguran, angkatan kerja, formal vs informal, sektor pekerjaan |
| `#/kesehatan` | Kesehatan: harapan hidup, IPM, stunting balita |
| `#/pendidikan` | Pendidikan: harapan lama sekolah, rata-rata lama sekolah, partisipasi sekolah |
| `#/daerah` | Daerah: penjelajah provinsi — cari dan urutkan 7 provinsi terpadat, plus IPM dan kemiskinan tertinggi |
| `#/sumber` | Sumber data & metodologi: setiap angka, sumbernya, dan tahunnya |

Semua grafik digambar dengan kode sendiri (SVG, tanpa pustaka), semua
kontrol — navigasi, tab grafik, pencarian dan pengurutan tabel,
tampilan tabel di bawah grafik — berfungsi penuh secara luring.

## Menjalankan

```sh
node serve.ts        # lalu buka http://localhost:8080
```

## Menyerahkan (hand-in)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke direktori keluaran dan
menulis `dossier.json` dengan pustaka `vendor/makefun-frontend.ts` dari
kit make.fun.

## Lisensi

MIT — lihat [LICENSE](LICENSE).
