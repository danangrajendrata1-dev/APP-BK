import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { StudentAssistanceFilters } from "@/features/student-assistances/types/studentAssistance";

type Props = { filters: StudentAssistanceFilters };
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({ label: String(index + 1), value: String(index + 1) }));

export function StudentAssistanceFilter({ filters }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Pendampingan Siswa Per Bulan</CardTitle>
        <CardDescription>Saring data berdasarkan kelas, bulan, dan tahun.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input name="className" label="Kelas" defaultValue={filters.className} />
          <Select name="month" label="Bulan" options={MONTH_OPTIONS} defaultValue={filters.month ? String(filters.month) : ""} placeholder="Semua bulan" />
          <Input name="year" label="Tahun" type="number" min={2000} max={2100} defaultValue={filters.year ? String(filters.year) : ""} />
          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-3 xl:flex-row xl:justify-end">
            <Button type="submit">Terapkan Filter</Button>
            <Button href="/student-assistances" variant="outline">Reset Filter</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
