import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

import type { ReportsFilters } from "@/features/reports/types/report";

type Props = {
  filters: ReportsFilters;
};

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const MONTH_OPTIONS = MONTH_NAMES.map((name, index) => ({
  label: name,
  value: String(index + 1),
}));

const SEMESTER_OPTIONS = [
  { label: "Semester 1", value: "1" },
  { label: "Semester 2", value: "2" },
];

export function ReportsFilter({ filters }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Laporan dan Statistik</CardTitle>
        <CardDescription>Gunakan filter bulan, semester, tahun, dan kelas jika relevan untuk laporan yang ingin dibaca.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Select name="month" label="Bulan" options={MONTH_OPTIONS} defaultValue={filters.month ? String(filters.month) : ""} placeholder="Semua bulan" />
          <Select name="semester" label="Semester" options={SEMESTER_OPTIONS} defaultValue={filters.semester ? String(filters.semester) : ""} placeholder="Semua semester" />
          <Input name="year" label="Tahun" type="number" min={2000} max={2100} defaultValue={filters.year ? String(filters.year) : ""} />
          <Input name="className" label="Kelas" defaultValue={filters.className} />
          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-4 xl:flex-row xl:justify-end">
            <Button type="submit">Terapkan Filter</Button>
            <Button href="/reports" variant="outline">Reset Filter</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
