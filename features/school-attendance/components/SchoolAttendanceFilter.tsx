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
import { SCHOOL_ATTENDANCE_STATUS_OPTIONS } from "@/lib/constants/options";

import type { SchoolAttendanceFilters } from "@/features/school-attendance/types/schoolAttendance";

type SchoolAttendanceFilterProps = {
  filters: SchoolAttendanceFilters;
};

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: String(index + 1),
  value: String(index + 1),
}));

export function SchoolAttendanceFilter({
  filters,
}: SchoolAttendanceFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Presensi Sekolah</CardTitle>
        <CardDescription>
          Saring data berdasarkan bulan, tahun, kelas, dan status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Select
            name="month"
            label="Bulan"
            options={MONTH_OPTIONS}
            defaultValue={filters.month ? String(filters.month) : ""}
            placeholder="Semua bulan"
          />
          <Input
            name="year"
            label="Tahun"
            type="number"
            min={2000}
            max={2100}
            defaultValue={filters.year ? String(filters.year) : ""}
            placeholder="Contoh: 2026"
          />
          <Input
            name="className"
            label="Kelas"
            defaultValue={filters.className}
            placeholder="Contoh: X-TKJ-1"
          />
          <Select
            name="status"
            label="Status"
            options={[...SCHOOL_ATTENDANCE_STATUS_OPTIONS]}
            defaultValue={filters.status}
            placeholder="Semua status"
          />

          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-4 xl:flex-row xl:justify-end">
            <Button type="submit">Terapkan Filter</Button>
            <Button href="/school-attendance" variant="outline">
              Reset Filter
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
