import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

import type { ReportSection } from "@/features/reports/types/report";

type Props = {
  section: ReportSection;
};

export function ReportsTableSection({ section }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                {section.columns.map((column) => (
                  <th key={column} className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.length ? (
                section.rows.map((row, index) => (
                  <tr key={`${section.title}-${index}`} className="hover:bg-slate-50">
                    {section.columns.map((column) => (
                      <td key={column} className="border-b border-slate-100 px-4 py-3 text-slate-700">
                        {String(row[column] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={section.columns.length} className="px-4 py-6 text-center text-slate-500">
                    Belum ada data untuk laporan ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
