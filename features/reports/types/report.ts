import type { AssessmentType } from "@/types/common";

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
    topAssistanceTopics: ChartItem[];
    classesMostServed: ChartItem[];
  };
  assessmentChecklist: Array<{
    assessmentType: AssessmentType;
    available: boolean;
  }>;
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
