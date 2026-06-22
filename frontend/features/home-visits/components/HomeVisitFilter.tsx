import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { HomeVisitFilters } from "@/features/home-visits/types/homeVisit";

type Props = { filters: HomeVisitFilters };
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({ label: String(index + 1), value: String(index + 1) }));

export function HomeVisitFilter({ filters }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Home Visit</CardTitle>
        <CardDescription>Saring data berdasarkan bulan, tahun, kelas, dan nama siswa.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Select name="month" label="Bulan" options={MONTH_OPTIONS} defaultValue={filters.month ? String(filters.month) : ""} placeholder="Semua bulan" />
          <Input name="year" label="Tahun" type="number" min={2000} max={2100} defaultValue={filters.year ? String(filters.year) : ""} />
          <Input name="className" label="Kelas" defaultValue={filters.className} />
          <Input name="studentName" label="Nama Siswa" defaultValue={filters.studentName} />
          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-4 xl:flex-row xl:justify-end">
            <Button type="submit">Terapkan Filter</Button>
            <Button href="/home-visits" variant="outline">Reset Filter</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
