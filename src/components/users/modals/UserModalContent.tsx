import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from '@/lib/supabase/types';
import PersonalTab from './tabs/PersonalTab';
import RoleTab from './tabs/RoleTab';
import SecurityTab from './tabs/SecurityTab';
import { UserViewModal } from './UserViewModal';
import { createUser, updateUser } from '@/services';

export interface UserModalContentProps {
  user?: User;
  mode: 'create' | 'edit' | 'view';
  onSuccess?: () => void;
  currentUserRole?: string;
  currentUserId?: string;
}

export const UserModalContent: React.FC<UserModalContentProps> = ({
  user,
  mode,
  onSuccess,
  currentUserRole,
  currentUserId
}) => {
  const isViewMode = mode === 'view';
  
  // Initialize form state
  const [formData, setFormData] = useState({
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
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  
  // Load user data if editing or viewing
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
        password: '',
        is_active: user.is_active !== undefined ? user.is_active : true
      });
    }
  }, [user]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle boolean changes (checkboxes, switches)
  const handleBooleanChange = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Generate random password
  const generatePassword = async () => {
    setIsGeneratingPassword(true);
    try {
      // Generate a random password with numbers, uppercase, lowercase, and special chars
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      
      // Ensure minimum requirements
      password += 'Aa1!'; // Add at least one uppercase, lowercase, number, and special char
      
      // Add random characters to reach desired length
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // Shuffle the password to avoid predictable patterns
      password = password.split('').sort(() => Math.random() - 0.5).join('');
      
      setFormData(prev => ({ ...prev, password }));
    } catch (error) {
      console.error('Error generating password:', error);
      toast.error('Şifrə yaradılarkən xəta baş verdi');
    } finally {
      setIsGeneratingPassword(false);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Ad tələb olunur';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Soyad tələb olunur';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-poçt tələb olunur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Düzgün e-poçt daxil edin';
    }
    
    if (!formData.role_id) {
      newErrors.role_id = 'Rol tələb olunur';
    }
    
    // Check region_id if role requires it
    if (formData.role_id && (
      formData.role_id.includes('region') || 
      formData.role_id.includes('sector') || 
      formData.role_id.includes('school')
    ) && !formData.region_id) {
      newErrors.region_id = 'Region tələb olunur';
    }
    
    // Check sector_id if role requires it
    if (formData.role_id && (
      formData.role_id.includes('sector') || 
      formData.role_id.includes('school')
    ) && !formData.sector_id) {
      newErrors.sector_id = 'Sektor tələb olunur';
    }
    
    // Check school_id if role requires it
    if (formData.role_id && formData.role_id.includes('school') && !formData.school_id) {
      newErrors.school_id = 'Məktəb tələb olunur';
    }
    
    // Password validation for new users
    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Şifrə tələb olunur';
    } else if (mode === 'create' && formData.password.length < 8) {
      newErrors.password = 'Şifrə ən azı 8 simvol olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        await createUser(formData);
        toast.success('İstifadəçi uğurla yaradıldı');
      } else if (mode === 'edit' && user) {
        await updateUser(user.id, formData);
        toast.success('İstifadəçi uğurla yeniləndi');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('İstifadəçi yadda saxlanarkən xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If it's view mode, render the view modal instead
  if (mode === "view" && user) {
    return <UserViewModal 
      user={user} 
      onClose={onSuccess} 
    />;
  }
  
  // Return the edit/create form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="personal">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="personal">Şəxsi məlumatlar</TabsTrigger>
          <TabsTrigger value="role">Rol və təyinat</TabsTrigger>
          <TabsTrigger value="security">Təhlükəsizlik</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4 pt-4">
          <PersonalTab
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            isViewMode={isViewMode}
            user={user}
          />
        </TabsContent>
        
        <TabsContent value="role" className="space-y-4 pt-4">
          <RoleTab
            formData={formData}
            handleSelectChange={handleSelectChange}
            errors={errors}
            isViewMode={isViewMode}
            currentUserRole={currentUserRole}
          />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 pt-4">
          <SecurityTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleBooleanChange={handleBooleanChange}
            errors={errors}
            isViewMode={isViewMode}
            user={user}
            generatePassword={generatePassword}
            isGeneratingPassword={isGeneratingPassword}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-4">
        {!isViewMode && (
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saxlanılır...' : 'Saxla'}
          </Button>
        )}
      </div>
    </form>
  );
};

export default UserModalContent;
