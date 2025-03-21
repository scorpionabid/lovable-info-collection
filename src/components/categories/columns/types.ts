
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

// Component prop interfaces
export interface CategoryColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName?: string;
  onColumnAdded?: () => void;
  onColumnDeleted?: () => void;
}

export interface ColumnFormProps {
  column?: CategoryColumn;
  categoryId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedColumn: CategoryColumn | null;
  formMode: 'create' | 'edit';
}

export interface ColumnsTableProps {
  columns: CategoryColumn[];
  categoryId: string;
  onEditColumn: (column: CategoryColumn) => void;
  onDeleteColumn: (column: CategoryColumn) => void;
  isLoading?: boolean;
  isError?: boolean;
  onAddColumn?: () => void;
  onRefetch?: () => void;
}
