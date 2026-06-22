# 02_SETUP_ENV_SUPABASE.md - Setup Environment dan Supabase Client

## Tujuan

Menyiapkan koneksi frontend ke Supabase menggunakan environment variable.

## File yang Dibuat

```txt
frontend/.env.local.example
frontend/lib/supabase/client.ts
frontend/lib/supabase/server.ts
frontend/types/database.ts
```

## `.env.local.example`

Buat file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jangan isi credential asli di file contoh.

## Supabase Client Browser

File:

```txt
frontend/lib/supabase/client.ts
```

Isi fungsi untuk membuat Supabase client browser. Gunakan package resmi Supabase.

## Supabase Server Client

File:

```txt
frontend/lib/supabase/server.ts
```

Buat helper untuk penggunaan server component/middleware jika diperlukan.

## Database Types

File:

```txt
frontend/types/database.ts
```

Untuk awal, boleh berisi placeholder type `Database` sambil menunggu generate dari Supabase.

## Install Package

Dari folder `frontend`:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Aturan

- Jangan hardcode URL Supabase.
- Jangan hardcode anon key.
- Semua akses Supabase harus lewat helper di `lib/supabase`.
- Jangan simpan service role key di frontend.

## Acceptance Criteria

- `.env.local.example` tersedia.
- Supabase client bisa dibuat dari environment variable.
- Build tidak error karena env helper.
- Tidak ada credential asli di repository.
