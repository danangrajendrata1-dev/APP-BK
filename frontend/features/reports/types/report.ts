export type ReportsFilters = {
  month?: number;
  semester?: 1 | 2;
  year?: number;
  className?: string;
};

export type ReportRow = Record<string, string | number>;

export type ReportSection = {
  title: string;
  description: string;
  columns: string[];
  rows: ReportRow[];
};

export type ChartItem = {
  label: string;
  value: number;
};

export type ReportsData = {
  filters: ReportsFilters;
  reportSections: ReportSection[];
  charts: {
    counselingPerMonth: ChartItem[];
    studentsMostServed: ChartItem[];
    attendanceByStatus: ChartItem[];
    topViolationTypes: ChartItem[];
    classesMostServed: ChartItem[];
  };
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
