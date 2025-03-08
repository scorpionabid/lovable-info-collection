import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, GripVertical, Edit, Trash2 } from "lucide-react";
import { CategoryType, CategoryColumn } from "./CategoryDetailView";
import * as categoryService from '@/services/supabase/category';

interface CategoryColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryType;
}

export const CategoryColumnsModal = ({ isOpen, onClose, category }: CategoryColumnsModalProps) => {
  const queryClient = useQueryClient();
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<CategoryColumn | null>(null);
  const [columnFormMode, setColumnFormMode] = useState<'create' | 'edit'>('create');
  const [columnFormData, setColumnFormData] = useState<Partial<CategoryColumn>>({
    name: '',
    type: 'text',
    required: true,
    description: '',
    options: []
  });
  const [columnFormErrors, setColumnFormErrors] = useState<Record<string, string>>({});
  
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

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  const createColumnMutation = useMutation({
    mutationFn: (data: categoryService.CreateColumnDto) => 
      categoryService.createColumn(category.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-columns', category.id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsColumnModalOpen(false);
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
      queryClient.invalidateQueries({ queryKey: ['category-columns', category.id] });
      setIsColumnModalOpen(false);
      toast.success('Sütun uğurla yeniləndi');
    },
    onError: (error) => {
      toast.error(`Sütun yenilənərkən xəta baş verdi: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });

  const deleteColumnMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteColumn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-columns', category.id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Sütun uğurla silindi');
    },
    onError: (error) => {
      toast.error(`Sütun silinərkən xəta baş verdi: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });

  useEffect(() => {
    if (selectedColumn && columnFormMode === 'edit') {
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
  }, [selectedColumn, columnFormMode, isColumnModalOpen]);

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

    if (columnFormMode === 'create') {
      createColumnMutation.mutate(columnData as categoryService.CreateColumnDto);
    } else if (columnFormMode === 'edit' && selectedColumn) {
      updateColumnMutation.mutate({ 
        id: selectedColumn.id, 
        data: columnData 
      });
    }
  };

  const isSubmitting = createColumnMutation.isPending || updateColumnMutation.isPending;

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
            <div className="flex justify-between items-center mb-4">
              <p className="text-infoline-dark-gray">
                Bu kateqoriya üçün məlumat sütunlarını idarə edin. Sütunların nizamlanması funksiyası tezliklə əlavə olunacaq.
              </p>
              <Button 
                onClick={handleAddColumn}
                className="bg-infoline-blue hover:bg-infoline-dark-blue"
              >
                <Plus className="mr-2 h-4 w-4" />
                Yeni Sütun
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
              </div>
            ) : isError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                <p>Sütunları yükləyərkən xəta baş verdi. Zəhmət olmasa bir daha cəhd edin.</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => refetch()}
                >
                  Yenidən cəhd et
                </Button>
              </div>
            ) : (
              <div className="bg-infoline-lightest-gray rounded-lg border border-infoline-light-gray overflow-hidden mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="bg-infoline-light-gray border-b border-infoline-gray">
                      <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue w-10">#</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Sütun adı</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Tip</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Məcburilik</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Təsvir</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-infoline-dark-blue">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedColumns.length > 0 ? (
                      sortedColumns.map((column, index) => (
                        <tr key={column.id} className="border-b border-infoline-light-gray hover:bg-white transition-colors">
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center">
                              <GripVertical className="h-4 w-4 text-infoline-dark-gray cursor-move mr-2" />
                              <span className="text-sm text-infoline-dark-gray">{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{column.name}</td>
                          <td className="px-4 py-3 text-sm text-infoline-dark-gray capitalize">{column.type}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <span className={`h-2.5 w-2.5 rounded-full ${column.required ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-infoline-dark-gray truncate max-w-[200px]">
                            {column.description}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditColumn(column)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteColumn(column.id)}
                                disabled={deleteColumnMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-infoline-dark-gray">
                          Bu kateqoriya üçün hələ sütun əlavə edilməyib.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Bağla
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isColumnModalOpen} onOpenChange={setIsColumnModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {columnFormMode === 'create' ? 'Yeni Sütun Əlavə Et' : 'Sütunu Redaktə Et'}
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
              onClick={() => setIsColumnModalOpen(false)}
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
              ) : columnFormMode === 'create' ? 'Əlavə et' : 'Yadda saxla'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
