import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { ASSESSMENT_TYPE_OPTIONS } from "@/lib/constants/options";

import type { AssessmentFilters } from "@/features/assessments/types/assessment";

type Props = {
  filters: AssessmentFilters;
};

export function AssessmentFilter({ filters }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Inventori dan Asesmen</CardTitle>
        <CardDescription>Saring daftar file berdasarkan jenis asesmen.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
          <Select
            name="assessmentType"
            label="Jenis Asesmen"
            options={[...ASSESSMENT_TYPE_OPTIONS]}
            defaultValue={filters.assessmentType}
            placeholder="Semua jenis"
          />
          <Button type="submit">Terapkan Filter</Button>
          <Button href="/assessments" variant="outline">Reset Filter</Button>
        </form>
      </CardContent>
    </Card>
  );
}
