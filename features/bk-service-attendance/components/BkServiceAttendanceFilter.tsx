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
import {
  BK_SERVICE_PURPOSE_OPTIONS,
} from "@/lib/constants/options";

import type { BkServiceAttendanceFilters } from "@/features/bk-service-attendance/types/bkServiceAttendance";

type BkServiceAttendanceFilterProps = {
  filters: BkServiceAttendanceFilters;
};

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: String(index + 1),
  value: String(index + 1),
}));

export function BkServiceAttendanceFilter({
  filters,
}: BkServiceAttendanceFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Daftar Hadir dan Catatan Kunjungan BK</CardTitle>
        <CardDescription>
          Saring data berdasarkan bulan, tahun, kelas, dan keperluan.
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
            name="purpose"
            label="Keperluan"
            options={[...BK_SERVICE_PURPOSE_OPTIONS]}
            defaultValue={filters.purpose}
            placeholder="Semua keperluan"
          />

          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-4 xl:flex-row xl:justify-end">
            <Button type="submit">Terapkan Filter</Button>
            <Button href="/bk-service-attendance" variant="outline">
              Reset Filter
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
