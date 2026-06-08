import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DOCUMENT_TYPE_OPTIONS } from "@/lib/constants/options";
import type { DocumentFilters } from "@/features/documents/types/document";

type Props = { filters: DocumentFilters };

export function DocumentFilter({ filters }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Surat & Dokumen</CardTitle>
        <CardDescription>Saring data berdasarkan tanggal, jenis surat, nama siswa, dan kelas.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input type="date" name="documentDate" label="Tanggal" defaultValue={filters.documentDate} />
          <Select name="documentType" label="Jenis Surat" options={[...DOCUMENT_TYPE_OPTIONS]} defaultValue={filters.documentType} placeholder="Semua jenis" />
          <Input name="studentName" label="Nama Siswa" defaultValue={filters.studentName} />
          <Input name="className" label="Kelas" defaultValue={filters.className} />
          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-4 xl:flex-row xl:justify-end">
            <Button type="submit">Terapkan Filter</Button>
            <Button href="/documents" variant="outline">Reset Filter</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
