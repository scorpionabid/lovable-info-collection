
export interface ReportParams {
  startDate?: string;
  endDate?: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  categoryId?: string;
  status?: string;
}

export interface CriticalArea {
  id: string;
  name: string;
  severity: number;
  impact: number;
  description: string;
}

export interface ReportResult<T> {
  data: T;
  error: any;
}

export interface ExportConfig {
  format: 'xlsx' | 'pdf' | 'csv';
  filters?: Record<string, any>;
}
