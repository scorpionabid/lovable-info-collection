
/**
 * Data əməliyyatları üçün tiplər
 */

export interface DataEntry {
  id: string;
  category_id: string;
  column_id: string;
  school_id: string;
  value: any;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
}

export interface CreateDataDto {
  category_id: string;
  column_id: string;
  school_id: string;
  value: any;
  created_by?: string;
  data?: any;
}

export interface UpdateDataDto {
  value?: any;
  status?: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
}

export interface DataHistory {
  id: string;
  data_id: string;
  data: any;
  status: string;
  changed_by: string;
  changed_at: string;
}
