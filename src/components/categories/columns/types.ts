
import { CategoryType, CategoryColumn } from "../CategoryDetailView";

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
