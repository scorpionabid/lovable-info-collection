
// Types shared across report services
export interface CompletionStatistic {
  name: string;
  value: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  change?: number;
}

export interface RegionPerformance {
  region: string;
  sector: string;
  performance: number;
  onTimeSubmission: number;
  quality: number;
  change: number;
}

export interface ComparisonData {
  category: string;
  previousYear: number;
  currentYear: number;
  change: number;
}

export interface CriticalArea {
  region: string;
  sector: string;
  category: string;
  completionRate: number;
  status: 'Gecikmiş' | 'Risk' | 'Normal';
}

export interface ReportParams {
  filter?: string;
  regionId?: string;
  sectorId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  periodType?: 'week' | 'month' | 'quarter' | 'year';
}

export interface CustomReportDefinition {
  id?: string;
  name: string;
  description?: string;
  reportType: string;
  parameters: Record<string, any>;
  visualType: 'table' | 'bar' | 'line' | 'pie';
  createdBy?: string;
  createdAt?: string;
}
