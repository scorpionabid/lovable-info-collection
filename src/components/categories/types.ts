
// Define CategoryType for usage in CategoryDetails and other components
export interface CategoryType {
  id: string;
  name: string;
  description: string;
  assignment: string;
  status: string;
  priority: number;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  school_type_id?: string;
  deadline: string;
  completionRate: number;
  createdAt: string;
  columns: CategoryColumn[];
  created_at?: string;
  updated_at?: string;
}

export interface CategoryColumn {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  options?: string[] | any;
  order: number;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ColumnData {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  options?: string[];
  order: number;
}
