# 14_TESTING_AND_QA.md - Testing dan Quality Assurance

## Tujuan

Melakukan pengecekan akhir agar aplikasi sesuai PRD dan aman digunakan.

## Checklist PRD

Pastikan semua menu tersedia:

- [ ] Dashboard
- [ ] Inventori dan Asesmen
- [ ] Data Siswa
- [ ] Presensi Sekolah
- [ ] Presensi Layanan BK
- [ ] Catatan Konseling
- [ ] Catatan Pendampingan Siswa Per Bulan
- [ ] Daftar Pendampingan Siswa Per Kelas
- [ ] Surat & Dokumen
- [ ] Home Visit
- [ ] Kotak Curhat Digital
- [ ] Laporan dan Statistik

## Checklist Field

- [ ] Semua field Data Siswa sesuai PRD.
- [ ] Semua field Presensi Sekolah sesuai PRD.
- [ ] Semua field Presensi Layanan BK sesuai PRD.
- [ ] Semua field Catatan Konseling sesuai PRD.
- [ ] Semua field Pendampingan sesuai PRD.
- [ ] Semua field Surat & Dokumen sesuai PRD.
- [ ] Semua field Home Visit sesuai PRD.
- [ ] Semua field Kotak Curhat Digital sesuai PRD.

## Checklist Dropdown

- [ ] Status siswa sesuai PRD.
- [ ] Status presensi sekolah sesuai PRD.
- [ ] Keperluan layanan BK sesuai PRD.
- [ ] Jenis layanan sesuai PRD.
- [ ] Media konseling sesuai PRD.
- [ ] Jenis konseling sesuai PRD.
- [ ] Kode pendampingan sesuai PRD.
- [ ] Jenis surat sesuai PRD.
- [ ] Kategori curhat sesuai PRD.

## Checklist Security

- [ ] User belum login tidak bisa masuk dashboard.
- [ ] Logout membersihkan session.
- [ ] Siswa hanya bisa akses Kotak Curhat Digital.
- [ ] Siswa tidak bisa membaca data konseling.
- [ ] Siswa tidak bisa membaca data siswa lain.
- [ ] Guru BK bisa mengelola data BK.
- [ ] Admin bisa mengelola seluruh data.
- [ ] RLS aktif di semua tabel sensitif.
- [ ] Tidak ada policy `using (true)` berbahaya.

## Checklist Responsive

- [ ] Desktop rapi.
- [ ] Mobile rapi.
- [ ] Sidebar mobile menjadi drawer.
- [ ] Tabel lebar bisa horizontal scroll.
- [ ] Form mobile satu kolom.

## Perintah Cek

Dari folder `frontend`:

```bash
npm run lint
npm run build
```

## Acceptance Criteria

- Build sukses.
- Lint tidak error besar.
- Semua menu PRD tersedia.
- Semua field dan dropdown sesuai PRD.
- Role dan RLS berjalan.
- Aplikasi siap demo ke klien.
