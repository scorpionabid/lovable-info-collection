
import { useState } from 'react';
import { toast } from 'sonner';
import { CreateSchoolDto } from '@/services/supabase/school/types';

export const useSchoolHelpers = () => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const clearFormErrorsOnChange = (fieldName: string) => {
    if (formErrors[fieldName]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (data: CreateSchoolDto) => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Məktəb adı tələb olunur';
    } else if (data.name.length < 3) {
      errors.name = 'Məktəb adı ən azı 3 simvol olmalıdır';
    }

    if (!data.region_id) {
      errors.region_id = 'Region seçilməlidir';
    }

    if (!data.sector_id) {
      errors.sector_id = 'Sektor seçilməlidir';
    }

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Düzgün email formatı daxil edin';
    }

    // Number validation
    if (data.student_count !== undefined && data.student_count < 0) {
      errors.student_count = 'Şagird sayı mənfi ola bilməz';
    }

    if (data.teacher_count !== undefined && data.teacher_count < 0) {
      errors.teacher_count = 'Müəllim sayı mənfi ola bilməz';
    }

    setFormErrors(errors);

    // If there are any errors, show a toast
    if (Object.keys(errors).length > 0) {
      toast.error('Xahiş edirik, məlumatları düzgün daxil edin');
      return false;
    }

    return true;
  };

  const getErrorMessage = (field: string) => {
    return formErrors[field] || '';
  };

  return {
    formErrors,
    setFormErrors,
    clearFormErrorsOnChange,
    validateForm,
    getErrorMessage
  };
};
