# 09_MODULE_STUDENTS.md - Modul Data Siswa

## Tujuan

Membuat modul Data Siswa sesuai PRD.

## Route

```txt
/students
/students/create
/students/[id]
/students/[id]/edit
```

## Field PRD

- NISN
- Nama Lengkap
- Jenis Kelamin
- Kelas
- Jurusan
- Tempat Tanggal Lahir
- Alamat
- Nomor HP
- Nama Orang Tua/Wali
- No HP Orang Tua
- Status Siswa

## Status Siswa

Dropdown:

- Aktif
- Lulus
- Pindah
- Off

## Struktur Feature

```txt
frontend/features/students/
├── components/
│   ├── StudentTable.tsx
│   ├── StudentForm.tsx
│   ├── StudentFilter.tsx
│   └── StudentStatusBadge.tsx
├── services/
│   └── studentService.ts
├── schemas/
│   └── studentSchema.ts
└── types/
    └── student.ts
```

## Fungsi Service

- `getStudents`
- `getStudentById`
- `createStudent`
- `updateStudent`
- `deleteStudent`

## Filter

- Nama siswa
- NISN
- Kelas
- Jurusan
- Status

## Acceptance Criteria

- Data siswa bisa ditampilkan.
- Data siswa bisa ditambah.
- Data siswa bisa diedit.
- Data siswa bisa dilihat detailnya.
- Status siswa sesuai dropdown PRD.
- Tabel menggunakan pagination.
- Nomor HP disimpan sebagai teks.
