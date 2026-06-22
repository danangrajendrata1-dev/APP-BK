# 13_MODULE_ASSESSMENTS_REPORTS_DASHBOARD.md - Asesmen, Laporan, dan Dashboard

## Tujuan

Membuat Inventori dan Asesmen, Laporan dan Statistik, serta Dashboard sesuai PRD.

---

# A. Inventori dan Asesmen

## Route

```txt
/assessments
```

## File yang Harus Tersedia

- Angket Kebutuhan Siswa
- Inventori Tugas Perkembangan
- Angket Minat Karier
- Angket Gaya Belajar
- Daftar Cek Masalah (DCM)
- Sosiometri

## Acceptance Criteria

- Admin/guru BK bisa upload file asesmen.
- File yang wajib tersedia sesuai PRD.
- File bisa dilihat/download sesuai hak akses.

---

# B. Laporan dan Statistik

## Route

```txt
/reports
```

## Laporan

- Rekap Kehadiran Sekolah
- Rekap Konseling
- Rekap Pendampingan
- Rekap Pemanggilan Orang Tua
- Rekap Home Visit
- Rekap Per Kelas
- Rekap Per Semester
- Rekap Per Tahun

## Grafik

- Konseling per bulan
- Siswa terbanyak menerima layanan
- Kehadiran siswa
- Topik pendampingan terbanyak
- Kelas dengan layanan BK terbanyak

## Acceptance Criteria

- Semua laporan PRD tersedia.
- Semua grafik PRD tersedia.
- Bisa filter bulan, semester, tahun, dan kelas jika relevan.

---

# C. Dashboard

## Route

```txt
/dashboard
```

## Ringkasan Wajib

- Jumlah siswa
- Jumlah siswa per kelas
- Jumlah konseling per bulan
- Jumlah pendampingan per bulan
- Jumlah surat terbit
- Jumlah home visit
- Jumlah curhat digital

## Acceptance Criteria

- Dashboard mengambil data otomatis dari database.
- Tidak menggunakan angka dummy permanen.
- Data sesuai indikator PRD.
