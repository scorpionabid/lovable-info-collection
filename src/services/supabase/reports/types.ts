
export interface ReportParams {
  startDate?: string;
  endDate?: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  categoryId?: string;
  status?: string;
  filter?: string;
  periodType?: 'week' | 'month' | 'quarter' | 'year';
}

export interface CriticalArea {
  id: string;
  name: string;
  severity: number;
  impact: number;
  description: string;
  region?: string;
  sector?: string;
  category?: string;
  completionRate?: number;
  status?: string;
}

export interface ReportResult<T> {
  data: T;
  error: any;
}

export interface ExportConfig {
  format: 'xlsx' | 'pdf' | 'csv';
  filters?: Record<string, any>;
}

export interface CompletionStatistic {
  id?: string;
  category?: string;
  totalEntries?: number;
  completedEntries?: number;
  completionRate?: number;
  onTimeSubmissions?: number;
  lateSubmissions?: number;
  status?: string;
  // For chart compatibility
  name?: string;
  value?: number;
}

export interface CustomReportDefinition {
  id: string;
  name: string;
  description: string;
  report_type: string;
  parameters: any;
  visual_type: string;
  created_by: string;
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RegionPerformance {
  id: string;
  name: string;
  metric: number;
  previousMetric: number;
  change: number;
  // For compatibility with some components
  region?: string;
  sector?: string;
  performance?: number;
  onTimeSubmission?: number;
  quality?: number;
}

export interface ComparisonData {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  // For compatibility with yearlyComparison
  category?: string;
  previousYear?: number;
  currentYear?: number;
}
