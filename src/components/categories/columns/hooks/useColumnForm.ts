
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryColumn } from "@/components/categories/columns/types";
import * as categoryService from '@/services/supabase/category';

export const useColumnForm = (
  categoryId: string,
  selectedColumn: CategoryColumn | null,
  formMode: 'create' | 'edit',
  onClose: () => void,
  onSuccess: () => void
) => {
  const queryClient = useQueryClient();
  const [columnFormData, setColumnFormData] = useState<Partial<CategoryColumn>>({
    name: '',
    type: 'text',
    required: true,
    description: '',
    options: []
  });
  const [columnFormErrors, setColumnFormErrors] = useState<Record<string, string>>({});

  const createColumnMutation = useMutation({
    mutationFn: (data: categoryService.CreateColumnDto) => 
      categoryService.createColumn(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-columns', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onClose();
      onSuccess();
      toast.success('Sütun uğurla əlavə edildi');
    },
    onError: (error) => {
      toast.error(`Sütun əlavə edilərkən xəta baş verdi: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });

  const updateColumnMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: categoryService.UpdateColumnDto }) => 
      categoryService.updateColumn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-columns', categoryId] });
      onClose();
      onSuccess();
      toast.success('Sütun uğurla yeniləndi');
    },
    onError: (error) => {
      toast.error(`Sütun yenilənərkən xəta baş verdi: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });

  useEffect(() => {
    if (selectedColumn && formMode === 'edit') {
      setColumnFormData({
        name: selectedColumn.name,
        type: selectedColumn.type,
        required: selectedColumn.required,
        description: selectedColumn.description,
        options: selectedColumn.options
      });
    } else {
      setColumnFormData({
        name: '',
        type: 'text',
        required: true,
        description: '',
        options: []
      });
    }
    setColumnFormErrors({});
  }, [selectedColumn, formMode]);

  const handleColumnFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setColumnFormData(prev => ({ ...prev, [name]: value }));
    
    if (columnFormErrors[name]) {
      setColumnFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleColumnTypeChange = (value: string) => {
    setColumnFormData(prev => ({ ...prev, type: value }));
    
    if (columnFormErrors.type) {
      setColumnFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.type;
        return newErrors;
      });
    }
  };

  const handleRequiredChange = (checked: boolean) => {
    setColumnFormData(prev => ({ ...prev, required: checked }));
  };

  const validateColumnForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!columnFormData.name?.trim()) {
      errors.name = 'Sütun adı tələb olunur';
    }
    
    if (!columnFormData.type) {
      errors.type = 'Sütun tipi seçilməlidir';
    }
    
    setColumnFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveColumn = () => {
    if (!validateColumnForm()) {
      toast.error('Zəhmət olmasa bütün tələb olunan sahələri doldurun');
      return;
    }

    const columnData = {
      name: columnFormData.name!,
      type: columnFormData.type!,
      required: columnFormData.required || false,
      description: columnFormData.description,
      options: columnFormData.options
    };

    if (formMode === 'create') {
      createColumnMutation.mutate(columnData as categoryService.CreateColumnDto);
    } else if (formMode === 'edit' && selectedColumn) {
      updateColumnMutation.mutate({ 
        id: selectedColumn.id, 
        data: columnData 
      });
    }
  };

  const isSubmitting = createColumnMutation.isPending || updateColumnMutation.isPending;

  return {
    columnFormData,
    columnFormErrors,
    isSubmitting,
    handleColumnFormChange,
    handleColumnTypeChange,
    handleRequiredChange,
    handleSaveColumn
  };
};
