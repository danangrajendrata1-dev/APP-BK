import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type Props = {
  summary: {
    attendanceRows: number;
    counselingRows: number;
    classAssistanceRows: number;
    parentCallRows: number;
    classRows: number;
    semesterRows: number;
    yearlyRows: number;
  };
};

export function ReportsSummaryGrid({ summary }: Props) {
  const items = [
    { label: "Rekap Kehadiran Sekolah", value: summary.attendanceRows },
    { label: "Rekap Pelanggaran", value: summary.counselingRows },
    { label: "Rekap Pelanggaran Kelas", value: summary.classAssistanceRows },
    { label: "Rekap Surat & Dokumen", value: summary.parentCallRows },
    { label: "Rekap Per Kelas", value: summary.classRows },
    { label: "Rekap Per Semester", value: summary.semesterRows },
    { label: "Rekap Per Tahun", value: summary.yearlyRows },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardTitle className="text-base">{item.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
