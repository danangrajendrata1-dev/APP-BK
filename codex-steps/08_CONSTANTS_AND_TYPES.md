# 08_CONSTANTS_AND_TYPES.md - Constants, Dropdown, dan Types

## Tujuan

Membuat dropdown dan type yang konsisten sesuai PRD.

## File

```txt
frontend/lib/constants/options.ts
frontend/types/common.ts
```

## Dropdown Wajib

### Status Siswa

- Aktif
- Lulus
- Pindah
- Off

### Status Presensi Sekolah

- Hadir
- Izin
- Sakit
- Alfa
- Terlambat

### Keperluan Layanan BK

- Konseling Individu
- Konseling Kelompok
- Layanan Klasikal
- Informasi Karier
- Informasi Sekolah Lanjutan
- Pemanggilan
- Lainnya

### Jenis Layanan

- Layanan Dasar
- Layanan Responsif
- Layanan Perencanaan Individual
- Layanan Dukungan Sistem

### Media Konseling

- Offline
- Online

### Jenis Konseling

- Individu
- Kelompok

### Kode Pendampingan

- T: Terlambat
- S: Tidak Seragam
- ID: Tidak memakai ID Card
- R: Rambut panjang / semir
- RK: Rokok
- K: Korek
- M: Make up menor
- Lainnya: Pelanggaran lainnya

### Jenis Surat

- Surat Panggilan Orang Tua
- Surat Home Visit
- Surat Kontrak Perilaku Siswa
- Surat Pernyataan Siswa
- Surat Peringatan 1
- Surat Peringatan 2
- Surat Peringatan 3
- Berita Acara Panggilan Orang Tua
- Contoh Surat Pengunduran Diri

### Kategori Curhat

- Pribadi
- Sosial
- Belajar
- Karier
- Keluarga
- Lainnya

## Acceptance Criteria

- Semua dropdown PRD tersedia di satu file constants.
- Tidak ada string dropdown hardcode berulang di halaman.
- Type umum tersedia untuk pagination, filter, dan role.
