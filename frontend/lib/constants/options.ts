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
  { label: "S", value: "S" },
  { label: "I", value: "I" },
  { label: "A", value: "A" },
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

export const CONFESSION_CATEGORY_OPTIONS = [
  { label: "Pribadi", value: "Pribadi" },
  { label: "Sosial", value: "Sosial" },
  { label: "Belajar", value: "Belajar" },
  { label: "Karier", value: "Karier" },
  { label: "Keluarga", value: "Keluarga" },
  { label: "Lainnya", value: "Lainnya" },
] as const satisfies readonly SelectOption[];

export const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Guru BK", value: "guru_bk" },
  { label: "Kepala Sekolah", value: "kepala_sekolah" },
  { label: "Siswa", value: "siswa" },
] as const satisfies readonly SelectOption[];
