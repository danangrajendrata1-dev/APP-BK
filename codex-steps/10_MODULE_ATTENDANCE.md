# 10_MODULE_ATTENDANCE.md - Modul Presensi Sekolah dan Presensi Layanan BK

## Tujuan

Membuat dua modul presensi sesuai PRD.

---

# A. Presensi Sekolah

## Route

```txt
/school-attendance
```

## Field

- Tanggal
- Nama Siswa
- Kelas
- Status
- Keterangan

## Status

Dropdown:

- Hadir
- Izin
- Sakit
- Alfa
- Terlambat

## Feature Folder

```txt
frontend/features/school-attendance/
├── components/
├── services/
├── schemas/
└── types/
```

## Acceptance Criteria

- Bisa mencatat presensi sekolah per tanggal.
- Bisa filter bulan, tahun, kelas, status.
- Nama siswa mengambil referensi dari `students`.
- Kelas otomatis bisa mengikuti data siswa jika siswa dipilih.

---

# B. Presensi Layanan BK

## Route

```txt
/bk-service-attendance
```

## Field

- Tanggal
- Nama Siswa
- Kelas
- Jam Datang
- Jam Selesai
- Keperluan
- Jenis Layanan
- Guru BK
- Keterangan

## Keperluan

Dropdown:

- Konseling Individu
- Konseling Kelompok
- Layanan Klasikal
- Informasi Karier
- Informasi Sekolah Lanjutan
- Pemanggilan
- Lainnya

## Jenis Layanan

Dropdown:

- Layanan Dasar
- Layanan Responsif
- Layanan Perencanaan Individual
- Layanan Dukungan Sistem

## Feature Folder

```txt
frontend/features/bk-service-attendance/
├── components/
├── services/
├── schemas/
└── types/
```

## Acceptance Criteria

- Bisa mencatat kunjungan siswa ke BK.
- Jam datang dan jam selesai valid.
- Keperluan sesuai PRD.
- Jenis layanan sesuai PRD.
- Bisa filter bulan, tahun, kelas, keperluan, jenis layanan, guru BK.
