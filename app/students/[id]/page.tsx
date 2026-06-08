import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { StudentStatusBadge } from "@/features/students/components/StudentStatusBadge";
import { getStudentById } from "@/features/students/services/studentService";

type StudentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-800">{value || "-"}</p>
    </div>
  );
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { id } = await params;
  const student = await getStudentById(id);

  if (!student) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Detail Data Siswa"
        description="Lihat detail lengkap data induk siswa untuk kebutuhan administrasi dan layanan BK."
      />

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>{student.fullName}</CardTitle>
            <CardDescription>
              NISN {student.nisn} • {student.className} • {student.major}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <StudentStatusBadge status={student.status} />
            <Button href={`/students/${student.id}/edit`} variant="outline">
              Edit Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <DetailItem label="NISN" value={student.nisn} />
          <DetailItem label="Nama Lengkap" value={student.fullName} />
          <DetailItem label="Jenis Kelamin" value={student.gender} />
          <DetailItem label="Kelas" value={student.className} />
          <DetailItem label="Jurusan" value={student.major} />
          <DetailItem
            label="Tempat Tanggal Lahir"
            value={student.birthPlaceDate}
          />
          <DetailItem label="Nomor HP" value={student.phone} />
          <DetailItem label="Nama Orang Tua/Wali" value={student.parentName} />
          <DetailItem label="No HP Orang Tua" value={student.parentPhone} />
          <DetailItem label="Status Siswa" value={student.status} />
          <div className="md:col-span-2">
            <DetailItem label="Alamat" value={student.address} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
