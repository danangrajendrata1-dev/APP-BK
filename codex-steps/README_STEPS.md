# README_STEPS.md - Urutan Step Codex Bangun Ulang Aplikasi BK

Gunakan file ini sebagai panduan urutan kerja Codex.

## Urutan Step

1. `00_MASTER_RULES.md`
2. `01_CREATE_PROJECT_STRUCTURE.md`
3. `02_SETUP_ENV_SUPABASE.md`
4. `03_DATABASE_MIGRATIONS.md`
5. `04_SECURITY_RLS_POLICIES.md`
6. `05_AUTH_AND_ROLES.md`
7. `06_LAYOUT_AND_NAVIGATION.md`
8. `07_SHARED_UI_COMPONENTS.md`
9. `08_CONSTANTS_AND_TYPES.md`
10. `09_MODULE_STUDENTS.md`
11. `10_MODULE_ATTENDANCE.md`
12. `11_MODULE_COUNSELING_ASSISTANCE.md`
13. `12_MODULE_DOCUMENTS_HOME_VISIT_CONFESSION.md`
14. `13_MODULE_ASSESSMENTS_REPORTS_DASHBOARD.md`
15. `14_TESTING_AND_QA.md`
16. `15_DEPLOYMENT_GUIDE.md`

## Cara Menggunakan dengan Codex

Berikan prompt seperti ini:

```txt
Baca AGENTS.md, PRD.md, TECHNICAL_DESIGN.md, DATABASE_SCHEMA.md, SECURITY_RULES.md, lalu kerjakan step 01_CREATE_PROJECT_STRUCTURE.md saja. Jangan kerjakan step lain. Jangan tambah fitur di luar PRD. Setelah selesai, berikan ringkasan file yang dibuat/diubah dan perintah manual yang perlu saya jalankan.
```

Untuk step berikutnya, ubah nama filenya saja.

## Aturan Penting

- Jangan berikan semua step sekaligus ke Codex jika ingin hemat token.
- Kerjakan satu step per sesi.
- Setelah satu step selesai, cek hasilnya dulu.
- Commit per step agar mudah rollback.
- Jika Codex ingin melakukan refactor besar, hentikan dulu dan minta penjelasan.
