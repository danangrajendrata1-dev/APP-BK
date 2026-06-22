import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { DocumentFilters } from "@/features/documents/types/document";

type Props = { filters: DocumentFilters };

export function DocumentFilter({ filters }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Surat & Dokumen</CardTitle>
        <CardDescription>Saring data berdasarkan judul surat atau dokumen.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input name="title" label="Judul" defaultValue={filters.title} />
          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-3 xl:flex-row xl:justify-end">
            <Button type="submit">Terapkan Filter</Button>
            <Button href="/documents" variant="outline">Reset Filter</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
