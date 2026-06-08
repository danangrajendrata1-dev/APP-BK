import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { CONFESSION_CATEGORY_OPTIONS } from "@/lib/constants/options";
import type { ConfessionFilters } from "@/features/confession-box/types/confession";

type Props = { filters: ConfessionFilters };

export function ConfessionFilter({ filters }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Kotak Curhat</CardTitle>
        <CardDescription>Saring data berdasarkan kategori curhat.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
          <Select name="category" label="Kategori" options={[...CONFESSION_CATEGORY_OPTIONS]} defaultValue={filters.category} placeholder="Semua kategori" />
          <Button type="submit">Terapkan Filter</Button>
          <Button href="/confession-box" variant="outline">Reset Filter</Button>
        </form>
      </CardContent>
    </Card>
  );
}
