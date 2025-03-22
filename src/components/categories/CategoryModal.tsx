
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { CategoryType } from './CategoryDetailView';
import * as categoryService from '@/services/supabase/category';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  category?: CategoryType;
  onSuccess?: () => void;
}

export const CategoryModal = ({ isOpen, onClose, mode, category, onSuccess }: CategoryModalProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assignment: 'All' as 'All' | 'Sectors' | 'Regions' | 'Schools',
    priority: 1,
    status: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        name: category.name,
        description: category.description || '',
        assignment: category.assignment as 'All' | 'Sectors' | 'Regions' | 'Schools',
        priority: category.priority,
        status: category.status === 'active',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        assignment: 'All',
        priority: 1,
        status: true,
      });
    }
    setFormErrors({});
  }, [category, mode, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: categoryService.CreateCategoryDto) => categoryService.createCategory(data),
    onSuccess: () => {
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(`Kateqoriya yaradılarkən xəta baş verdi: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: categoryService.UpdateCategoryDto }) => 
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(`Kateqoriya yenilənərkən xəta baş verdi: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Kateqoriya adı tələb olunur';
    }
    
    if (!formData.assignment) {
      errors.assignment = 'Təyinat seçilməlidir';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Zəhmət olmasa bütün tələb olunan sahələri doldurun');
      return;
    }

    const categoryData = {
      name: formData.name,
      description: formData.description,
      assignment: formData.assignment,
      priority: formData.priority,
      status: formData.status ? 'active' : 'inactive' as categoryService.CategoryStatus
    };

    if (mode === 'create') {
      createMutation.mutate(categoryData as categoryService.CreateCategoryDto);
    } else if (mode === 'edit' && category) {
      updateMutation.mutate({ 
        id: category.id, 
        data: categoryData as categoryService.UpdateCategoryDto
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-infoline-light-gray">
          <h2 className="text-xl font-semibold text-infoline-dark-blue">
            {mode === 'create' ? 'Yeni Kateqoriya Yarat' : 'Kateqoriyanı Redaktə Et'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Əsas Məlumatlar</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={formErrors.name ? 'text-red-500' : ''}>
                    Kateqoriya adı *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Kateqoriya adını daxil edin"
                    className={formErrors.name ? 'border-red-500' : ''}
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Təsvir</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Kateqoriya haqqında qısa məlumat"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignment" className={formErrors.assignment ? 'text-red-500' : ''}>
                    Təyinat *
                  </Label>
                  <Select
                    value={formData.assignment}
                    onValueChange={(value) => handleSelectChange('assignment', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="assignment" className={formErrors.assignment ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Təyinat seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Bütün məktəblər (All)</SelectItem>
                      <SelectItem value="Regions">Regionlar (Regions)</SelectItem>
                      <SelectItem value="Sectors">Sektorlar (Sectors)</SelectItem>
                      <SelectItem value="Schools">Məktəblər (Schools)</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.assignment && (
                    <p className="text-xs text-red-500">{formErrors.assignment}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioritet *</Label>
                  <Input
                    id="priority"
                    name="priority"
                    type="number"
                    min={1}
                    value={formData.priority}
                    onChange={handleChange}
                    placeholder="Prioritet daxil edin"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Kateqoriya statusu</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={formData.status}
                      onCheckedChange={(checked) => handleSwitchChange('status', checked)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="status" className="text-sm">
                      {formData.status ? 'Aktiv' : 'Deaktiv'}
                    </Label>
                  </div>
                </div>
              </TabsContent>
              
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-infoline-light-gray">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Ləğv et
                </Button>
                <Button 
                  type="submit" 
                  className="bg-infoline-blue hover:bg-infoline-dark-blue"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                      Gözləyin...
                    </span>
                  ) : mode === 'create' ? 'Yarat' : 'Yadda saxla'}
                </Button>
              </div>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
