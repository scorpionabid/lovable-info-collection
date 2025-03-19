
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
    if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      errors.contactEmail = 'Düzgün email formatı daxil edin';
    }

    // Number validation
    if (data.studentCount < 0) {
      errors.studentCount = 'Şagird sayı mənfi ola bilməz';
    }

    if (data.teacherCount < 0) {
      errors.teacherCount = 'Müəllim sayı mənfi ola bilməz';
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
