
// Define types for category columns
export interface CategoryColumn {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  options?: string[];
  category_id?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

// Define common column data interface
export interface ColumnData {
  id: string;
  name: string;
  type: string;
  required: boolean;
  options?: string[];
  description?: string;
}
