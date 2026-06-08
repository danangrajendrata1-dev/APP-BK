import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { STUDENT_STATUS_OPTIONS } from "@/lib/constants/options";

import type { StudentFilters } from "@/features/students/types/student";

type StudentFilterProps = {
  filters: StudentFilters;
};

export function StudentFilter({ filters }: StudentFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Data Siswa</CardTitle>
        <CardDescription>
          Cari siswa berdasarkan nama, NISN, kelas, jurusan, atau status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Input
            name="fullName"
            label="Nama Siswa"
            placeholder="Cari nama siswa"
            defaultValue={filters.fullName}
          />
          <Input
            name="nisn"
            label="NISN"
            placeholder="Cari NISN"
            defaultValue={filters.nisn}
          />
          <Input
            name="className"
            label="Kelas"
            placeholder="Contoh: X-TKJ-1"
            defaultValue={filters.className}
          />
          <Input
            name="major"
            label="Jurusan"
            placeholder="Contoh: TKJ"
            defaultValue={filters.major}
          />
          <Select
            name="status"
            label="Status"
            options={[...STUDENT_STATUS_OPTIONS]}
            defaultValue={filters.status}
            placeholder="Semua status"
          />

          <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-end xl:col-span-5 xl:justify-end">
            <Button type="submit">Terapkan Filter</Button>
            <Button href="/students" variant="outline">
              Reset Filter
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
