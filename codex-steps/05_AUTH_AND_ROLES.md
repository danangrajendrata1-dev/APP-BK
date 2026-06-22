# 05_AUTH_AND_ROLES.md - Implementasi Auth dan Role

## Tujuan

Membuat login, register, logout, session handling, dan proteksi route berdasarkan role.

## Route

Buat route:

```txt
/login
/register
```

## Role

Role yang digunakan:

- admin
- guru_bk
- siswa

## Register

Untuk MVP:

- Register boleh membuat akun siswa/guru BK sesuai kebutuhan form.
- Jangan berikan pilihan admin secara bebas pada halaman register publik.
- Admin sebaiknya dibuat manual dari Supabase atau oleh admin existing.

## Login

Login menggunakan Supabase Auth.

Field:

- email
- password

## Logout

Logout harus:

- Memanggil Supabase signOut
- Menghapus session client
- Mengarahkan ke `/login`

## Middleware / Route Guard

Rule:

- User belum login diarahkan ke `/login`.
- User sudah login tidak perlu kembali ke `/login`.
- Siswa hanya boleh akses `/confession-box`.
- Guru BK dan admin boleh akses menu sesuai PRD.

## File yang Dibuat / Diubah

```txt
frontend/app/login/page.tsx
frontend/app/register/page.tsx
frontend/lib/auth/permissions.ts
frontend/middleware.ts
frontend/components/layout/LogoutButton.tsx
```

## Acceptance Criteria

- User bisa register sesuai aturan.
- User bisa login.
- User bisa logout.
- Setelah logout, dashboard tidak bisa dibuka tanpa login.
- Siswa tidak bisa membuka dashboard dan modul sensitif.
- Guru BK dan admin bisa membuka menu PRD.
