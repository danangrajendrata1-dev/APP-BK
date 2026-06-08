export type DashboardMetric = {
  label: string;
  value: number;
  helper: string;
};

export type DashboardSeriesItem = {
  label: string;
  value: number;
};

export type DashboardSummary = {
  metrics: DashboardMetric[];
  studentsPerClass: DashboardSeriesItem[];
  counselingPerMonth: DashboardSeriesItem[];
  assistancePerMonth: DashboardSeriesItem[];
};
