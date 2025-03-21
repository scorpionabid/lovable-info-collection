
import { useState, useEffect } from 'react';
import { User } from '@/supabase/types';

export const useUserForm = (user?: User) => {
  const initialData = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role_id: '',
    region_id: '',
    sector_id: '',
    school_id: '',
    utis_code: '',
    password: '',
    is_active: true
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with user data if provided
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role_id: user.role_id || '',
        region_id: user.region_id || '',
        sector_id: user.sector_id || '',
        school_id: user.school_id || '',
        utis_code: user.utis_code || '',
        password: '', // Empty for editing
        is_active: user.is_active
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.first_name) newErrors.first_name = 'Ad daxil edin';
    if (!formData.last_name) newErrors.last_name = 'Soyad daxil edin';
    if (!formData.email) newErrors.email = 'Email daxil edin';
    if (!formData.role_id) newErrors.role_id = 'Rol seçin';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Düzgün email formatı daxil edin';
    }
    
    // Password required for new users
    if (!user && !formData.password) {
      newErrors.password = 'Şifrə daxil edin';
    }
    
    // Password strength
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Şifrə ən azı 8 simvol olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    
    // Clear error for phone field
    if (errors.phone) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleRoleChange = (roleId: string) => {
    // Reset region, sector, and school when role changes
    setFormData(prev => ({
      ...prev,
      role_id: roleId,
      region_id: '',
      sector_id: '',
      school_id: ''
    }));
    
    // Clear role error
    if (errors.role_id) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.role_id;
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  const isFormValid = Object.keys(errors).length === 0;

  return {
    formData,
    setFormData,
    errors,
    validateForm,
    handleInputChange,
    handlePhoneChange,
    handleRoleChange,
    resetForm,
    isFormValid
  };
};

export default useUserForm;
