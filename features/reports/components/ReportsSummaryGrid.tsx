import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type Props = {
  summary: {
    attendanceRows: number;
    counselingRows: number;
    assistanceRows: number;
    parentCallRows: number;
    homeVisitRows: number;
    classRows: number;
    semesterRows: number;
    yearlyRows: number;
  };
};

export function ReportsSummaryGrid({ summary }: Props) {
  const items = [
    { label: "Rekap Kehadiran Sekolah", value: summary.attendanceRows },
    { label: "Rekap Konseling", value: summary.counselingRows },
    { label: "Rekap Pendampingan", value: summary.assistanceRows },
    { label: "Rekap Pemanggilan Orang Tua", value: summary.parentCallRows },
    { label: "Rekap Home Visit", value: summary.homeVisitRows },
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
