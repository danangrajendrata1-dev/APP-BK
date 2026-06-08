import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

import type { DashboardMetric } from "@/features/dashboard/types/dashboard";

type Props = {
  metrics: DashboardMetric[];
};

export function DashboardMetricGrid({ metrics }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <CardTitle className="text-base">{metric.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-3xl font-semibold text-slate-900">{metric.value}</p>
            <p className="text-sm text-slate-500">{metric.helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
