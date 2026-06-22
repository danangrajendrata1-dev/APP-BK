# 11_MODULE_COUNSELING_ASSISTANCE.md - Konseling dan Pendampingan

## Tujuan

Membuat modul Catatan Konseling, Catatan Pendampingan Siswa Per Bulan, dan Daftar Pendampingan Siswa Per Kelas sesuai PRD.

---

# A. Catatan Konseling

## Route

```txt
/counseling-records
```

## Field

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

## Media

- Offline
- Online

## Jenis Konseling

- Individu
- Kelompok

## Acceptance Criteria

- Bisa mencatat konseling.
- Bisa filter bulan, tahun, kelas, media, jenis konseling.
- Data sensitif hanya admin/guru BK.

---

# B. Catatan Pendampingan Siswa Per Bulan

## Route

```txt
/student-assistances
```

## Kode Pendampingan

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

## Field

- Nomor
- Nama Siswa
- Tanggal 1–31
- Jumlah
- Keterangan

## Acceptance Criteria

- Tampilan menyerupai tabel bulanan.
- Tanggal 1 sampai 31 tersedia.
- Jumlah dihitung dari isian tanggal.
- Bisa filter kelas, bulan, tahun.

---

# C. Daftar Pendampingan Siswa Per Kelas

## Route

```txt
/class-assistances
```

## Field

- Nomor
- Nama Siswa
- Jenis Pelanggaran
- Bentuk Tindakan
- Remisi
- Keterangan
- SP Akhir

## Acceptance Criteria

- Bisa mencatat daftar pendampingan per kelas.
- Bisa filter kelas, jenis pelanggaran, SP Akhir.
- Data hanya untuk admin/guru BK.
