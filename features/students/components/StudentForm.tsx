"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { STUDENT_STATUS_OPTIONS } from "@/lib/constants/options";

import {
  INITIAL_STUDENT_FORM_STATE,
} from "@/features/students/schemas/studentSchema";
import type { StudentFormState } from "@/features/students/types/student";
import type { StudentFormValues } from "@/types/common";

type StudentFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  initialValues?: StudentFormValues;
  action: (
    state: StudentFormState,
    formData: FormData,
  ) => Promise<StudentFormState>;
};

const DEFAULT_VALUES: StudentFormValues = {
  ...INITIAL_STUDENT_FORM_STATE.values,
};

export function StudentForm({
  action,
  description,
  initialValues = DEFAULT_VALUES,
  submitLabel,
  title,
}: StudentFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_STUDENT_FORM_STATE,
    values: initialValues,
  });

  const values = state.values;

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>

      {state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          name="nisn"
          label="NISN"
          defaultValue={values.nisn}
          error={state.errors.nisn}
          placeholder="Masukkan NISN siswa"
        />
        <Input
          name="fullName"
          label="Nama Lengkap"
          defaultValue={values.fullName}
          error={state.errors.fullName}
          placeholder="Masukkan nama lengkap siswa"
        />
        <Input
          name="gender"
          label="Jenis Kelamin"
          defaultValue={values.gender}
          error={state.errors.gender}
          placeholder="Contoh: Laki-laki"
        />
        <Input
          name="className"
          label="Kelas"
          defaultValue={values.className}
          error={state.errors.className}
          placeholder="Contoh: X-TKJ-1"
        />
        <Input
          name="major"
          label="Jurusan"
          defaultValue={values.major}
          error={state.errors.major}
          placeholder="Contoh: Teknik Komputer dan Jaringan"
        />
        <Input
          name="birthPlaceDate"
          label="Tempat Tanggal Lahir"
          defaultValue={values.birthPlaceDate}
          error={state.errors.birthPlaceDate}
          placeholder="Contoh: Bandung, 12 Januari 2008"
        />
        <Input
          name="phone"
          label="Nomor HP"
          defaultValue={values.phone}
          error={state.errors.phone}
          placeholder="Masukkan nomor HP siswa"
        />
        <Input
          name="parentName"
          label="Nama Orang Tua/Wali"
          defaultValue={values.parentName}
          error={state.errors.parentName}
          placeholder="Masukkan nama orang tua atau wali"
        />
        <Input
          name="parentPhone"
          label="No HP Orang Tua"
          defaultValue={values.parentPhone}
          error={state.errors.parentPhone}
          placeholder="Masukkan nomor HP orang tua atau wali"
        />
        <Select
          name="status"
          label="Status Siswa"
          options={[...STUDENT_STATUS_OPTIONS]}
          defaultValue={values.status}
          error={state.errors.status}
        />
        <div className="md:col-span-2">
          <Textarea
            name="address"
            label="Alamat"
            defaultValue={values.address}
            error={state.errors.address}
            rows={4}
            placeholder="Masukkan alamat lengkap siswa"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button href="/students" variant="outline">
          Kembali
        </Button>
        <Button type="submit" isLoading={isPending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
