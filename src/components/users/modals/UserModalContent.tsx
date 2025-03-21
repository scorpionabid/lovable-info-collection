
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UserForm } from './UserForm';
import { RoleTab } from './role/RoleTab';
import { useUserFormSubmit } from '../hooks/useUserFormSubmit';
import { useOrganizationData } from '../hooks/useOrganizationData';
import { useUserFormHandling } from '../hooks/useUserFormHandling';

export interface UserModalContentProps {
  user?: any;
  mode?: 'create' | 'edit' | 'view';
  onSuccess?: () => void;
  onClose?: () => void;
  currentUserId?: string;
  currentUserRole?: string;
}

export const UserModalContent: React.FC<UserModalContentProps> = ({
  user,
  mode = 'create',
  onSuccess,
  onClose,
  currentUserId,
  currentUserRole
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const { handleSubmit, submitStatus } = useUserFormSubmit(mode, onSuccess);
  
  const {
    formData,
    setFormData,
    errors,
    validateForm,
    handleInputChange,
    handlePhoneChange,
    handleRoleChange,
    resetForm
  } = useUserFormHandling(user, mode);
  
  const roleData = useOrganizationData(formData.roleId);
  
  const saveUser = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    
    await handleSubmit(formData);
  };
  
  // Check if user has permission to edit role
  const canEditRole = () => {
    if (mode === 'create') return true;
    if (!currentUserRole || !currentUserId) return false;
    
    // SuperAdmin can edit all roles
    if (currentUserRole === 'super-admin') return true;
    
    // Users can't edit their own role
    if (user?.id === currentUserId) return false;
    
    return false;
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h2 className="text-xl font-semibold">
          {mode === 'create' ? 'Yeni istifadəçi yarat' : 
           mode === 'edit' ? 'İstifadəçini redaktə et' : 
           'İstifadəçi məlumatları'}
        </h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="mb-4 grid grid-cols-2">
          <TabsTrigger value="profile">Şəxsi məlumatlar</TabsTrigger>
          <TabsTrigger value="role" disabled={!canEditRole()}>Rol və təşkilat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="flex-1">
          <UserForm 
            formData={formData}
            errors={errors}
            mode={mode}
            onChange={handleInputChange}
            onPhoneChange={handlePhoneChange}
          />
        </TabsContent>
        
        <TabsContent value="role" className="flex-1">
          <RoleTab
            formData={formData}
            errors={errors}
            onChange={handleRoleChange}
            roleData={roleData}
          />
        </TabsContent>
      </Tabs>
      
      {(mode === 'create' || mode === 'edit') && (
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Ləğv et
            </Button>
          )}
          <Button 
            onClick={saveUser} 
            disabled={submitStatus === 'loading'}
          >
            {submitStatus === 'loading' ? 'Yüklənir...' : 'Yadda saxla'}
          </Button>
        </div>
      )}
    </div>
  );
};
