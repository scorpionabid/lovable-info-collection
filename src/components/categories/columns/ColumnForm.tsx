
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryColumn } from "../CategoryDetailView";
import * as categoryService from '@/services/supabase/category';
import { ColumnFormProps } from './types';

export const ColumnForm = ({ 
  isOpen, 
  onClose, 
  selectedColumn, 
  formMode, 
  categoryId,
  onSuccess 
}: ColumnFormProps) => {
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
  }, [selectedColumn, formMode, isOpen]);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {formMode === 'create' ? 'Yeni Sütun Əlavə Et' : 'Sütunu Redaktə Et'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-name" className={columnFormErrors.name ? 'text-red-500' : ''}>
              Sütun adı *
            </Label>
            <Input
              id="column-name"
              name="name"
              placeholder="Sütun adını daxil edin"
              value={columnFormData.name || ''}
              onChange={handleColumnFormChange}
              className={columnFormErrors.name ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {columnFormErrors.name && (
              <p className="text-xs text-red-500">{columnFormErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="column-type" className={columnFormErrors.type ? 'text-red-500' : ''}>
              Sütun tipi *
            </Label>
            <Select 
              value={columnFormData.type} 
              onValueChange={handleColumnTypeChange}
              disabled={isSubmitting}
            >
              <SelectTrigger id="column-type" className={columnFormErrors.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Tip seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Mətn (Text)</SelectItem>
                <SelectItem value="number">Rəqəm (Number)</SelectItem>
                <SelectItem value="date">Tarix (Date)</SelectItem>
                <SelectItem value="select">Seçim (Select)</SelectItem>
                <SelectItem value="textarea">Uzun Mətn (Textarea)</SelectItem>
                <SelectItem value="checkbox">Seçim qutusu (Checkbox)</SelectItem>
                <SelectItem value="file">Fayl (File)</SelectItem>
              </SelectContent>
            </Select>
            {columnFormErrors.type && (
              <p className="text-xs text-red-500">{columnFormErrors.type}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="column-description">Təsvir</Label>
            <Input
              id="column-description"
              name="description"
              placeholder="Sütun təsvirini daxil edin"
              value={columnFormData.description || ''}
              onChange={handleColumnFormChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="column-required">Məcburilik statusu</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="column-required"
                checked={columnFormData.required}
                onCheckedChange={handleRequiredChange}
                disabled={isSubmitting}
              />
              <span className="text-sm text-infoline-dark-gray">Məcburi sahə</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Ləğv et
          </Button>
          <Button 
            onClick={handleSaveColumn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                Gözləyin...
              </span>
            ) : formMode === 'create' ? 'Əlavə et' : 'Yadda saxla'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
