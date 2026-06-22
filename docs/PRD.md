# PRD - Aplikasi BK Sederhana

## Gambaran Umum

Aplikasi BK (Bimbingan dan Konseling) merupakan aplikasi administrasi dan layanan BK sekolah yang digunakan untuk mengelola data siswa, asesmen, layanan BK, konseling, pendampingan siswa, surat-menyurat, home visit, curhat digital, serta laporan dan statistik.

---

## 1. Dashboard

Menampilkan ringkasan data secara otomatis:

- Jumlah siswa
- Jumlah siswa per kelas
- Jumlah konseling per bulan
- Jumlah pendampingan per bulan
- Jumlah surat terbit
- Jumlah home visit
- Jumlah curhat digital

### Data Dashboard

| Indikator | Jumlah |
|---|---|
| Jumlah Siswa | 1.500 |
| Jumlah Siswa per Kelas | DPIB:30, TITL:30, TPM:30, TSM:30, TKR:30, DKV:30 |
| Jumlah Konseling per Bulan | Jan:10, Feb:15, Mar:20 |
| Jumlah Pendampingan per Bulan | Jan:10, Feb:15, Mar:20 |
| Jumlah Surat Terbit | 10 |
| Jumlah Home Visit | 3 |
| Jumlah Curhat Digital | 12 |

---

## 2. Inventori dan Asesmen

File yang harus tersedia:

- Angket Kebutuhan Siswa
- Inventori Tugas Perkembangan
- Angket Minat Karier
- Angket Gaya Belajar
- Daftar Cek Masalah (DCM)
- Sosiometri

---

## 3. Data Siswa

Data induk siswa:

- NISN
- Nama Lengkap
- Jenis Kelamin
- Kelas
- Jurusan
- Tempat Tanggal Lahir
- Alamat
- Nomor HP
- Nama Orang Tua/Wali
- Status Siswa

### Status Siswa

Dropdown:

- Aktif
- Lulus
- Pindah
- Off

### Struktur Data

| NISN | Nama Siswa | JK | Kelas | Jurusan | TTL | Alamat | No HP | Nama Orang Tua | No HP Orang Tua | Status |
|---|---|---|---|---|---|---|---|---|---|---|

---

## 4. Presensi Sekolah

Daftar hadir siswa di sekolah per bulan.

### Field

- Tanggal
- Nama Siswa
- Kelas
- Status
- Keterangan

### Status

Dropdown:

- Hadir
- Izin
- Sakit
- Alfa
- Terlambat

### Struktur Data

| Tanggal | Nama Siswa | Kelas | Status | Keterangan |
|---|---|---|---|---|

---

## 5. Presensi Layanan BK

Daftar hadir siswa yang berkunjung ke BK.

### Field

- Tanggal
- Nama Siswa
- Kelas
- Jam Datang
- Jam Selesai
- Keperluan
- Jenis Layanan
- Guru BK
- Keterangan

### Keperluan

Dropdown:

- Konseling Individu
- Konseling Kelompok
- Layanan Klasikal
- Informasi Karier
- Informasi Sekolah Lanjutan
- Pemanggilan
- Lainnya

### Jenis Layanan

Dropdown:

- Layanan Dasar
- Layanan Responsif
- Layanan Perencanaan Individual
- Layanan Dukungan Sistem

### Struktur Data

| Tanggal | Nama Siswa | Kelas | Jam Datang | Jam Selesai | Keperluan | Jenis Layanan | Guru BK | Keterangan |
|---|---|---|---|---|---|---|---|---|

---

## 6. Catatan Konseling

Khusus layanan konseling.

### Field

- Tanggal
- Nama Siswa
- Kelas
- Pertemuan Ke-
- Media
- Jenis Konseling
- Topik
- Hasil Konseling
- Tindak Lanjut
- Keterangan

### Media

Dropdown:

- Offline
- Online

### Jenis Konseling

- Individu
- Kelompok

### Struktur Data

| Tanggal | Nama Siswa | Kelas | Pertemuan Ke- | Jenis Konseling | Topik | Hasil Konseling | Tindak Lanjut | Keterangan |
|---|---|---|---|---|---|---|---|---|

---

## 7. Catatan Pendampingan Siswa Per Bulan

Riwayat pendampingan dan pembinaan siswa per kelas.

### Kode Pendampingan

| Kode | Keterangan |
|---|---|
| T | Terlambat |
| S | Tidak Seragam |
| ID | Tidak memakai ID Card |
| R | Rambut panjang / semir |
| RK | Rokok |
| K | Korek |
| M | Make up menor |
| Lainnya | Pelanggaran lainnya |

### Field

- Nomor
- Nama Siswa
- Tanggal 1–31
- Jumlah
- Keterangan

---

## 8. Daftar Pendampingan Siswa Per Kelas

### Field

- Nomor
- Nama Siswa
- Jenis Pelanggaran
- Bentuk Tindakan
- Remisi
- Keterangan
- SP Akhir

---

## 9. Surat & Dokumen

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

### Pusat Administrasi BK

### Field

- Nomor Surat
- Tanggal
- Nama Siswa
- Jenis Surat
- File Lampiran
- Keterangan

### Struktur Data

| No Surat | Tanggal | Nama Siswa | Jenis Surat | File Lampiran | Keterangan |
|---|---|---|---|---|---|

---

## 10. Home Visit

### Field

- Tanggal
- Nama Siswa
- Nama Orang Tua/Wali
- Kelas
- Alamat
- Hasil Kunjungan
- Tindak Lanjut
- Dokumentasi

### Struktur Data

| Tanggal | Nama Siswa | Kelas | Alamat | Hasil Kunjungan | Tindak Lanjut | Dokumentasi |
|---|---|---|---|---|---|---|

---

## 11. Kotak Curhat Digital

Form pengaduan atau curhat siswa.

### Field

- Tanggal
- Nama Siswa (opsional)
- Kelas
- Kategori
- Isi Curhat
- Keterangan

### Kategori

Dropdown:

- Pribadi
- Sosial
- Belajar
- Karier
- Keluarga
- Lainnya

### Struktur Data

| Tanggal | Nama Siswa | Kelas | Kategori | Isi Curhat | Keterangan |
|---|---|---|---|---|---|

---

## 12. Laporan dan Statistik

### Laporan

- Rekap Kehadiran Sekolah
- Rekap Konseling
- Rekap Pendampingan
- Rekap Pemanggilan Orang Tua
- Rekap Home Visit
- Rekap Per Kelas
- Rekap Per Semester
- Rekap Per Tahun

### Grafik

- Konseling per bulan
- Siswa terbanyak menerima layanan
- Kehadiran siswa
- Topik pendampingan terbanyak
- Kelas dengan layanan BK terbanyak