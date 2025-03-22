
import { Json } from '../shared';

export interface DataEntry {
  id: string;
  category_id: string;
  school_id: string;
  data: Json;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_by: string;
  approved_by?: string;
  submitted_at?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DataHistory {
  id: string;
  data_id: string;
  data: Json;
  status: string;
  changed_by: string;
  changed_at: string;
}

export interface CreateDataDto {
  category_id: string;
  school_id: string;
  data: Json;
  status?: string;
  created_by: string;
}

export interface UpdateDataDto {
  data?: Json;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  submitted_at?: string;
}
