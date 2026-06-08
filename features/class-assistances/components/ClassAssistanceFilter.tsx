import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { ClassAssistanceFilters } from "@/features/class-assistances/types/classAssistance";

type Props = { filters: ClassAssistanceFilters };

export function ClassAssistanceFilter({ filters }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Daftar Pendampingan Per Kelas</CardTitle>
        <CardDescription>Saring data berdasarkan kelas, jenis pelanggaran, dan SP akhir.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input name="className" label="Kelas" defaultValue={filters.className} />
          <Input name="violationType" label="Jenis Pelanggaran" defaultValue={filters.violationType} />
          <Input name="finalWarningLetter" label="SP Akhir" defaultValue={filters.finalWarningLetter} />
          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-3 xl:flex-row xl:justify-end">
            <Button type="submit">Terapkan Filter</Button>
            <Button href="/class-assistances" variant="outline">Reset Filter</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
