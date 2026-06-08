export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

export const STUDENT_STATUS_OPTIONS = [
  { label: "Aktif", value: "Aktif" },
  { label: "Lulus", value: "Lulus" },
  { label: "Pindah", value: "Pindah" },
  { label: "Off", value: "Off" },
] as const satisfies readonly SelectOption[];

export const SCHOOL_ATTENDANCE_STATUS_OPTIONS = [
  { label: "Hadir", value: "Hadir" },
  { label: "Izin", value: "Izin" },
  { label: "Sakit", value: "Sakit" },
  { label: "Alfa", value: "Alfa" },
  { label: "Terlambat", value: "Terlambat" },
] as const satisfies readonly SelectOption[];

export const BK_SERVICE_PURPOSE_OPTIONS = [
  { label: "Konseling Individu", value: "Konseling Individu" },
  { label: "Konseling Kelompok", value: "Konseling Kelompok" },
  { label: "Layanan Klasikal", value: "Layanan Klasikal" },
  { label: "Informasi Karier", value: "Informasi Karier" },
  {
    label: "Informasi Sekolah Lanjutan",
    value: "Informasi Sekolah Lanjutan",
  },
  { label: "Pemanggilan", value: "Pemanggilan" },
  { label: "Lainnya", value: "Lainnya" },
] as const satisfies readonly SelectOption[];

export const BK_SERVICE_TYPE_OPTIONS = [
  { label: "Layanan Dasar", value: "Layanan Dasar" },
  { label: "Layanan Responsif", value: "Layanan Responsif" },
  {
    label: "Layanan Perencanaan Individual",
    value: "Layanan Perencanaan Individual",
  },
  { label: "Layanan Dukungan Sistem", value: "Layanan Dukungan Sistem" },
] as const satisfies readonly SelectOption[];

export const COUNSELING_MEDIA_OPTIONS = [
  { label: "Offline", value: "Offline" },
  { label: "Online", value: "Online" },
] as const satisfies readonly SelectOption[];

export const COUNSELING_TYPE_OPTIONS = [
  { label: "Individu", value: "Individu" },
  { label: "Kelompok", value: "Kelompok" },
] as const satisfies readonly SelectOption[];

export const ASSISTANCE_CODE_OPTIONS = [
  { label: "T - Terlambat", value: "T" },
  { label: "S - Tidak Seragam", value: "S" },
  { label: "ID - Tidak memakai ID Card", value: "ID" },
  { label: "R - Rambut panjang / semir", value: "R" },
  { label: "RK - Rokok", value: "RK" },
  { label: "K - Korek", value: "K" },
  { label: "M - Make up menor", value: "M" },
  { label: "Lainnya - Pelanggaran lainnya", value: "Lainnya" },
] as const satisfies readonly SelectOption[];

export const DOCUMENT_TYPE_OPTIONS = [
  {
    label: "Surat Panggilan Orang Tua",
    value: "Surat Panggilan Orang Tua",
  },
  { label: "Surat Home Visit", value: "Surat Home Visit" },
  {
    label: "Surat Kontrak Perilaku Siswa",
    value: "Surat Kontrak Perilaku Siswa",
  },
  { label: "Surat Pernyataan Siswa", value: "Surat Pernyataan Siswa" },
  { label: "Surat Peringatan 1", value: "Surat Peringatan 1" },
  { label: "Surat Peringatan 2", value: "Surat Peringatan 2" },
  { label: "Surat Peringatan 3", value: "Surat Peringatan 3" },
  {
    label: "Berita Acara Panggilan Orang Tua",
    value: "Berita Acara Panggilan Orang Tua",
  },
  {
    label: "Contoh Surat Pengunduran Diri",
    value: "Contoh Surat Pengunduran Diri",
  },
] as const satisfies readonly SelectOption[];

export const CONFESSION_CATEGORY_OPTIONS = [
  { label: "Pribadi", value: "Pribadi" },
  { label: "Sosial", value: "Sosial" },
  { label: "Belajar", value: "Belajar" },
  { label: "Karier", value: "Karier" },
  { label: "Keluarga", value: "Keluarga" },
  { label: "Lainnya", value: "Lainnya" },
] as const satisfies readonly SelectOption[];

export const ASSESSMENT_TYPE_OPTIONS = [
  { label: "Angket Kebutuhan Siswa", value: "Angket Kebutuhan Siswa" },
  {
    label: "Inventori Tugas Perkembangan",
    value: "Inventori Tugas Perkembangan",
  },
  { label: "Angket Minat Karier", value: "Angket Minat Karier" },
  { label: "Angket Gaya Belajar", value: "Angket Gaya Belajar" },
  { label: "Daftar Cek Masalah (DCM)", value: "Daftar Cek Masalah (DCM)" },
  { label: "Sosiometri", value: "Sosiometri" },
] as const satisfies readonly SelectOption[];

export const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Guru BK", value: "guru_bk" },
  { label: "Siswa", value: "siswa" },
] as const satisfies readonly SelectOption[];
