# 01_CREATE_PROJECT_STRUCTURE.md - Membuat Struktur Project dari Nol

## Tujuan

Membuat struktur awal project Aplikasi BK Sederhana dari nol sesuai PRD dan technical design.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL via Supabase
- Supabase Auth
- Supabase Storage

## Perintah Awal

Jalankan dari folder kerja utama:

```bash
npx create-next-app@latest frontend
```

Pilihan yang disarankan:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: No
- App Router: Yes
- Turbopack: boleh Yes
- Import alias: default boleh

## Struktur Root Project

Buat struktur seperti berikut:

```txt
bk-smart-smk/
├── frontend/
├── supabase/
│   ├── migrations/
│   └── seed/
├── docs/
│   ├── PRD.md
│   ├── TECHNICAL_DESIGN.md
│   ├── DATABASE_SCHEMA.md
│   ├── SECURITY_RULES.md
│   └── AGENTS.md
├── README.md
└── .gitignore
```

## Struktur Frontend

Di dalam `frontend/`, siapkan folder:

```txt
frontend/
├── app/
├── components/
│   ├── layout/
│   ├── ui/
│   └── shared/
├── features/
│   ├── dashboard/
│   ├── assessments/
│   ├── students/
│   ├── school-attendance/
│   ├── bk-service-attendance/
│   ├── counseling-records/
│   ├── student-assistances/
│   ├── class-assistances/
│   ├── documents/
│   ├── home-visits/
│   ├── confession-box/
│   └── reports/
├── lib/
│   ├── supabase/
│   ├── constants/
│   └── auth/
└── types/
```

## File Dokumentasi yang Harus Disalin

Masukkan dokumen berikut ke folder `docs/`:

- `PRD.md`
- `TECHNICAL_DESIGN.md`
- `DATABASE_SCHEMA.md`
- `SECURITY_RULES.md`
- `AGENTS.md`

## `.gitignore`

Pastikan minimal berisi:

```gitignore
node_modules
.next
.env
.env.local
.env.*.local
.vercel
.DS_Store
coverage
```

## Acceptance Criteria

- Project Next.js berhasil dibuat.
- Folder root project rapi.
- Folder `supabase/migrations` tersedia.
- Folder `docs` tersedia.
- Struktur `features` mengikuti 12 modul PRD.
- Tidak ada credential di source code.
