import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { COUNSELING_MEDIA_OPTIONS, COUNSELING_TYPE_OPTIONS } from "@/lib/constants/options";
import type { CounselingRecordFilters } from "@/features/counseling-records/types/counselingRecord";

type Props = { filters: CounselingRecordFilters };
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({ label: String(index + 1), value: String(index + 1) }));

export function CounselingRecordFilter({ filters }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Catatan Pelanggaran</CardTitle>
        <CardDescription>Saring data berdasarkan bulan, tahun, kelas, media, dan jenis konseling.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Select name="month" label="Bulan" options={MONTH_OPTIONS} defaultValue={filters.month ? String(filters.month) : ""} placeholder="Semua bulan" />
          <Input name="year" label="Tahun" type="number" min={2000} max={2100} defaultValue={filters.year ? String(filters.year) : ""} />
          <Input name="className" label="Kelas" defaultValue={filters.className} />
          <Select name="media" label="Media" options={[...COUNSELING_MEDIA_OPTIONS]} defaultValue={filters.media} placeholder="Semua media" />
          <Select name="counselingType" label="Jenis Konseling" options={[...COUNSELING_TYPE_OPTIONS]} defaultValue={filters.counselingType} placeholder="Semua jenis" />
          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-5 xl:flex-row xl:justify-end">
            <Button type="submit">Terapkan Filter</Button>
            <Button href="/counseling-records" variant="outline">Reset Filter</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
