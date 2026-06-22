# 12_MODULE_DOCUMENTS_HOME_VISIT_CONFESSION.md - Surat, Home Visit, dan Kotak Curhat

## Tujuan

Membuat modul Surat & Dokumen, Home Visit, dan Kotak Curhat Digital sesuai PRD.

---

# A. Surat & Dokumen

## Route

```txt
/documents
```

## Jenis Surat

- Surat Panggilan Orang Tua
- Surat Home Visit
- Surat Kontrak Perilaku Siswa
- Surat Pernyataan Siswa
- Surat Peringatan 1
- Surat Peringatan 2
- Surat Peringatan 3
- Berita Acara Panggilan Orang Tua
- Contoh Surat Pengunduran Diri

## Field

- Nomor Surat
- Tanggal
- Nama Siswa
- Jenis Surat
- File Lampiran
- Keterangan

## Acceptance Criteria

- Bisa upload file lampiran.
- Jenis surat sesuai PRD.
- Bisa filter tanggal, jenis surat, nama siswa, kelas.
- File tidak bisa diakses sembarangan.

---

# B. Home Visit

## Route

```txt
/home-visits
```

## Field

- Tanggal
- Nama Siswa
- Nama Orang Tua/Wali
- Kelas
- Alamat
- Hasil Kunjungan
- Tindak Lanjut
- Dokumentasi

## Acceptance Criteria

- Bisa mencatat home visit.
- Bisa upload dokumentasi.
- Bisa filter bulan, tahun, kelas, nama siswa.
- Data hanya untuk admin/guru BK.

---

# C. Kotak Curhat Digital

## Route

```txt
/confession-box
```

## Field

- Tanggal
- Nama Siswa opsional
- Kelas
- Kategori
- Isi Curhat
- Keterangan

## Kategori

- Pribadi
- Sosial
- Belajar
- Karier
- Keluarga
- Lainnya

## Acceptance Criteria

- Siswa bisa membuat curhat.
- Nama siswa opsional.
- Kategori sesuai PRD.
- Admin/guru BK bisa melihat data curhat.
- Siswa tidak boleh melihat semua curhat siswa lain.
