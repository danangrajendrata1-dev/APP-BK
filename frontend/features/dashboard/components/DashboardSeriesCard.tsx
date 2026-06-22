import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

import type { DashboardSeriesItem } from "@/features/dashboard/types/dashboard";

type Props = {
  title: string;
  description: string;
  series: DashboardSeriesItem[];
};

export function DashboardSeriesCard({ title, description, series }: Props) {
  const maxValue = Math.max(...series.map((item) => item.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {series.length ? (
          series.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span>{item.label}</span>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-slate-900"
                  style={{ width: `${Math.max((item.value / maxValue) * 100, 6)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">Belum ada data yang bisa ditampilkan.</p>
        )}
      </CardContent>
    </Card>
  );
}
