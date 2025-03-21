
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { School } from '@/lib/supabase/types';
import { useRegions } from '../hooks/useRegions';
import { useSectors } from '../hooks/useSectors';
import { useSchoolTypes } from '../hooks/useSchoolTypes';
import { createSchool, updateSchool } from '@/services';

export interface SchoolFormProps {
  school?: School | null;
  onClose: () => void;
  onSuccess?: () => void;
  regionId: string;
  mode: 'create' | 'edit';
}

export const SchoolForm: React.FC<SchoolFormProps> = ({
  school,
  onClose,
  onSuccess,
  regionId,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    director: '',
    email: '',
    phone: '',
    region_id: '',
    sector_id: '',
    type_id: '',
    student_count: 0,
    teacher_count: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { regions, isLoading: isLoadingRegions } = useRegions();
  const { sectors, isLoading: isLoadingSectors } = useSectors(formData.region_id);
  const { schoolTypes, isLoading: isLoadingTypes } = useSchoolTypes();
  
  // Initialize form with school data or preset regionId
  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name || '',
        code: school.code || '',
        address: school.address || '',
        director: school.director || '',
        email: school.email || '',
        phone: school.phone || '',
        region_id: school.region_id || '',
        sector_id: school.sector_id || '',
        type_id: school.type_id || '',
        student_count: school.student_count || 0,
        teacher_count: school.teacher_count || 0
      });
    } else if (regionId) {
      setFormData(prev => ({
        ...prev,
        region_id: regionId
      }));
    }
  }, [school, regionId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert to number for numeric fields
    if (name === 'student_count' || name === 'teacher_count') {
      const numValue = parseInt(value);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear sector_id when region_id changes
    if (name === 'region_id') {
      setFormData(prev => ({ ...prev, [name]: value, sector_id: '' }));
    }
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Məktəb adı tələb olunur';
    }
    
    if (!formData.region_id) {
      newErrors.region_id = 'Region seçimi tələb olunur';
    }
    
    if (!formData.sector_id) {
      newErrors.sector_id = 'Sektor seçimi tələb olunur';
    }
    
    if (!formData.type_id) {
      newErrors.type_id = 'Məktəb növü tələb olunur';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Düzgün e-poçt daxil edin';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        await createSchool(formData);
        toast.success('Məktəb uğurla yaradıldı');
      } else if (mode === 'edit' && school) {
        await updateSchool(school.id, formData);
        toast.success('Məktəb uğurla yeniləndi');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving school:', error);
      toast.error('Məktəb yadda saxlanarkən xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Məktəb adı</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="code">Məktəb kodu</Label>
          <Input
            id="code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Ünvan</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="region_id">Region</Label>
          <Select
            value={formData.region_id}
            onValueChange={(value) => handleSelectChange('region_id', value)}
            disabled={isLoadingRegions || !!regionId}
          >
            <SelectTrigger id="region_id" className={errors.region_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Region seçin" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region_id && <p className="text-red-500 text-sm">{errors.region_id}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sector_id">Sektor</Label>
          <Select
            value={formData.sector_id}
            onValueChange={(value) => handleSelectChange('sector_id', value)}
            disabled={isLoadingSectors || !formData.region_id}
          >
            <SelectTrigger id="sector_id" className={errors.sector_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Sektor seçin" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sector_id && <p className="text-red-500 text-sm">{errors.sector_id}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type_id">Məktəb növü</Label>
          <Select
            value={formData.type_id}
            onValueChange={(value) => handleSelectChange('type_id', value)}
            disabled={isLoadingTypes}
          >
            <SelectTrigger id="type_id" className={errors.type_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Növü seçin" />
            </SelectTrigger>
            <SelectContent>
              {schoolTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type_id && <p className="text-red-500 text-sm">{errors.type_id}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="director">Direktor</Label>
          <Input
            id="director"
            name="director"
            value={formData.director}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-poçt</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="student_count">Şagird sayı</Label>
          <Input
            id="student_count"
            name="student_count"
            type="number"
            min="0"
            value={formData.student_count}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="teacher_count">Müəllim sayı</Label>
          <Input
            id="teacher_count"
            name="teacher_count"
            type="number"
            min="0"
            value={formData.teacher_count}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Ləğv et
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saxlanılır...' : 'Saxla'}
        </Button>
      </div>
    </form>
  );
};

export default SchoolForm;
