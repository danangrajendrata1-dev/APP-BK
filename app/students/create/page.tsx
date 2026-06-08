import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/PageHeader";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";
import { StudentForm } from "@/features/students/components/StudentForm";
import {
  createStudentFormState,
  INITIAL_STUDENT_FORM_STATE,
  parseStudentFormData,
  validateStudentForm,
} from "@/features/students/schemas/studentSchema";
import { createStudent } from "@/features/students/services/studentService";
import type { StudentFormState } from "@/features/students/types/student";

export default function CreateStudentPage() {
  async function createStudentAction(
    _state: StudentFormState,
    formData: FormData,
  ): Promise<StudentFormState> {
    "use server";

    const values = parseStudentFormData(formData);
    const errors = validateStudentForm(values);

    if (Object.keys(errors).length > 0) {
      return createStudentFormState(
        values,
        errors,
        "Periksa kembali field yang wajib diisi.",
      );
    }

    try {
      const student = await createStudent(values);
      revalidatePath("/students");
      redirect(`/students/${student.id}`);
    } catch (error) {
      return createStudentFormState(
        values,
        {},
        error instanceof Error ? error.message : "Gagal menambahkan data siswa.",
      );
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Tambah Data Siswa"
        description="Lengkapi data induk siswa sesuai PRD untuk menyimpan informasi dasar yang dibutuhkan layanan BK."
      />

      <Card>
        <CardContent className="py-6">
          <StudentForm
            title="Form Data Siswa"
            description="Semua field mengikuti kebutuhan Data Siswa pada PRD. Nomor HP disimpan sebagai teks agar format tetap fleksibel."
            submitLabel="Simpan Data Siswa"
            action={createStudentAction}
            initialValues={INITIAL_STUDENT_FORM_STATE.values}
          />
        </CardContent>
      </Card>
    </section>
  );
}
