
import { CategoryType } from "../CategoryDetailView";

export interface CategoryColumn {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  options?: string[];
  order: number;
}

export interface CategoryColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryType;
}

export interface ColumnFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColumn: CategoryColumn | null;
  formMode: 'create' | 'edit';
  categoryId: string;
  onSuccess: () => void;
}

export interface ColumnsTableProps {
  columns: CategoryColumn[];
  isLoading: boolean;
  isError: boolean;
  onAddColumn: () => void;
  onEditColumn: (column: CategoryColumn) => void;
  onDeleteColumn: (columnId: string) => void;
  onRefetch: () => void;
}
