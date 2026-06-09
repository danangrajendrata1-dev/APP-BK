import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { StudentForm } from "@/features/students/components/StudentForm";
import {
  createStudentFormState,
  parseStudentFormData,
  validateStudentForm,
} from "@/features/students/schemas/studentSchema";
import {
  getStudentById,
  updateStudent,
} from "@/features/students/services/studentService";
import type { StudentFormState } from "@/features/students/types/student";
import type { StudentFormValues } from "@/types/common";

type EditStudentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function toFormValues(student: Awaited<ReturnType<typeof getStudentById>>): StudentFormValues {
  if (!student) {
    return {
      nisn: "",
      fullName: "",
      gender: "",
      className: "",
      major: "",
      birthPlaceDate: "",
      address: "",
      phone: "",
      parentName: "",
      parentPhone: "",
      status: "Aktif",
    };
  }

  return {
    nisn: student.nisn,
    fullName: student.fullName,
    gender: student.gender,
    className: student.className,
    major: student.major,
    birthPlaceDate: student.birthPlaceDate,
    address: student.address,
    phone: student.phone,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
    status: student.status,
  };
}

export default async function EditStudentPage({
  params,
}: EditStudentPageProps) {
  const { id } = await params;
  const student = await getStudentById(id);

  if (!student) {
    notFound();
  }

  async function updateStudentAction(
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
      await updateStudent(id, values);
      revalidatePath("/students");
      revalidatePath(`/students/${id}`);
      redirect(`/students/${id}`);
    } catch (error) {
      return createStudentFormState(
        values,
        {},
        error instanceof Error ? error.message : "Gagal memperbarui data siswa.",
      );
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Edit Data Siswa"
        description="Perbarui data siswa yang sudah tersimpan."
      />

      <Card>
        <CardContent className="py-6">
          <StudentForm
            title="Perbarui Data Siswa"
            description="Gunakan form ini untuk memperbarui data siswa yang sudah tersimpan."
            submitLabel="Simpan Perubahan"
            action={updateStudentAction}
            initialValues={toFormValues(student)}
          />
        </CardContent>
      </Card>
    </section>
  );
}
