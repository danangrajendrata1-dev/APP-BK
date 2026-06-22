# 07_SHARED_UI_COMPONENTS.md - Komponen UI Bersama

## Tujuan

Membuat komponen UI dasar agar tampilan konsisten dan kode tidak berulang.

## Komponen Wajib

Buat:

```txt
frontend/components/ui/Button.tsx
frontend/components/ui/Input.tsx
frontend/components/ui/Select.tsx
frontend/components/ui/Textarea.tsx
frontend/components/ui/Card.tsx
frontend/components/ui/Table.tsx
frontend/components/ui/Badge.tsx
frontend/components/shared/LoadingState.tsx
frontend/components/shared/EmptyState.tsx
frontend/components/shared/ErrorState.tsx
frontend/components/shared/ConfirmDialog.tsx
```

## Aturan

- Komponen harus sederhana.
- Gunakan TypeScript props yang jelas.
- Jangan terlalu kompleks.
- Jangan menambah library UI besar tanpa izin.
- Styling menggunakan Tailwind CSS.

## Acceptance Criteria

- Semua halaman bisa menggunakan komponen yang sama.
- Form input terlihat konsisten.
- Tabel terlihat konsisten.
- Loading, empty, dan error state tersedia.
