
export interface CategoryType {
  id: string;
  name: string;
  description: string;
  assignment: string;
  status: string;
  priority: number;
  columns: any[];
  completionRate: number;
  deadline: string;
  createdAt: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  school_type_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryTableProps {
  categories: CategoryType[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onDelete: (category: CategoryType) => Promise<void>;
  onUpdatePriority: (id: string, newPriority: number) => void;
}
