
import { useState } from 'react';
import { toast } from "sonner";
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import * as categoryService from '@/services/supabase/category';
import { ColumnsTable } from './columns/ColumnsTable';
import { ColumnForm } from './columns/ColumnForm';
import { CategoryColumnsModalProps } from './columns/types';
import { CategoryColumn } from './columns/types';

export const CategoryColumnsModal = ({ isOpen, onClose, category }: CategoryColumnsModalProps) => {
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<CategoryColumn | null>(null);
  const [columnFormMode, setColumnFormMode] = useState<'create' | 'edit'>('create');
  
  const { 
    data: columns = [], 
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ['category-columns', category.id],
    queryFn: () => categoryService.getCategoryColumns(category.id),
    enabled: isOpen
  });

  const deleteColumnMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteColumn(id),
    onSuccess: () => {
      refetch();
      toast.success('Sütun uğurla silindi');
    },
    onError: (error) => {
      toast.error(`Sütun silinərkən xəta baş verdi: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });

  const handleAddColumn = () => {
    setSelectedColumn(null);
    setColumnFormMode('create');
    setIsColumnModalOpen(true);
  };

  const handleEditColumn = (column: CategoryColumn) => {
    setSelectedColumn(column);
    setColumnFormMode('edit');
    setIsColumnModalOpen(true);
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (window.confirm('Bu sütunu silmək istədiyinizə əminsiniz?')) {
      deleteColumnMutation.mutate(columnId);
    }
  };

  const handleColumnFormClose = () => {
    setIsColumnModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-6 py-4 border-b border-infoline-light-gray">
            <h2 className="text-xl font-semibold text-infoline-dark-blue">
              Sütunları İdarə Et: {category.name}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <ColumnsTable 
              columns={columns}
              isLoading={isLoading}
              isError={isError}
              onAddColumn={handleAddColumn}
              onEditColumn={handleEditColumn}
              onDeleteColumn={handleDeleteColumn}
              onRefetch={refetch}
            />
            
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Bağla
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <ColumnForm 
        isOpen={isColumnModalOpen}
        onClose={handleColumnFormClose}
        selectedColumn={selectedColumn}
        formMode={columnFormMode}
        categoryId={category.id}
        onSuccess={() => refetch()}
      />
    </div>
  );
};
