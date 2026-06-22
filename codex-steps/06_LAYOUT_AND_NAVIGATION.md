# 06_LAYOUT_AND_NAVIGATION.md - Layout, Sidebar, dan Navigasi

## Tujuan

Membuat layout aplikasi dan sidebar sesuai 12 menu PRD.

## Menu Sidebar Wajib

1. Dashboard
2. Inventori dan Asesmen
3. Data Siswa
4. Presensi Sekolah
5. Presensi Layanan BK
6. Catatan Konseling
7. Catatan Pendampingan Siswa Per Bulan
8. Daftar Pendampingan Siswa Per Kelas
9. Surat & Dokumen
10. Home Visit
11. Kotak Curhat Digital
12. Laporan dan Statistik

## Route

| Menu | Route |
|---|---|
| Dashboard | `/dashboard` |
| Inventori dan Asesmen | `/assessments` |
| Data Siswa | `/students` |
| Presensi Sekolah | `/school-attendance` |
| Presensi Layanan BK | `/bk-service-attendance` |
| Catatan Konseling | `/counseling-records` |
| Catatan Pendampingan Siswa Per Bulan | `/student-assistances` |
| Daftar Pendampingan Siswa Per Kelas | `/class-assistances` |
| Surat & Dokumen | `/documents` |
| Home Visit | `/home-visits` |
| Kotak Curhat Digital | `/confession-box` |
| Laporan dan Statistik | `/reports` |

## Komponen

Buat komponen:

```txt
frontend/components/layout/AppLayout.tsx
frontend/components/layout/Sidebar.tsx
frontend/components/layout/Topbar.tsx
frontend/components/layout/MobileSidebar.tsx
frontend/components/shared/PageHeader.tsx
```

## Responsive

Desktop:

- Sidebar tetap di kiri.
- Konten di kanan.

Mobile:

- Sidebar menjadi drawer.
- Tombol menu terlihat jelas.
- Konten tidak keluar layar.
- Tabel menggunakan horizontal scroll.

## Acceptance Criteria

- Sidebar hanya berisi menu sesuai PRD.
- Route aktif terlihat jelas.
- Mobile tidak berantakan.
- Logout tersedia di layout.
- Siswa hanya melihat menu Kotak Curhat Digital.
