
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser } from "@/services";
import { useUserForm } from "../hooks/useUserForm";
import { useOrganizationData } from "../hooks/useOrganizationData";
import { PersonalTab } from "./tabs/PersonalTab";
import { RoleTab } from "./tabs/RoleTab";
import { SecurityTab } from "./tabs/SecurityTab";
import { User } from "@/supabase/types";
import { toast } from "sonner";

export interface UserModalContentProps {
  user?: User;
  mode: "create" | "edit" | "view";
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
  const [activeTab, setActiveTab] = useState("personal");
  const queryClient = useQueryClient();
  const isEditing = mode === "edit";
  const isViewing = mode === "view";
  
  const {
    form,
    errors,
    validateForm,
    handleInputChange,
    handlePhoneChange,
    handleRoleChange,
    resetForm,
    isFormValid,
    formData,
    setFormData
  } = useUserForm(user);
  
  const roleData = useOrganizationData(formData.role_id);
  
  const createUserMutation = useMutation({
    mutationFn: (userData: any) => {
      return isEditing 
        ? updateUser(user?.id || '', userData)
        : createUser(userData);
    },
    onSuccess: () => {
      toast.success(isEditing ? "İstifadəçi yeniləndi" : "İstifadəçi yaradıldı");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message}`);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Zəhmət olmasa formu düzgün doldurun");
      return;
    }
    
    const userData = { ...formData };
    // If password is empty and we're editing, remove it from the data
    if (isEditing && !userData.password) {
      delete userData.password;
    }
    
    createUserMutation.mutate(userData);
  };
  
  // Don't render the form in view mode
  if (isViewing) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{user?.first_name} {user?.last_name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-3">
            <p className="text-sm text-gray-500">Telefon</p>
            <p>{user?.phone || '-'}</p>
          </div>
          <div className="border rounded p-3">
            <p className="text-sm text-gray-500">UTİS kodu</p>
            <p>{user?.utis_code || '-'}</p>
          </div>
          <div className="border rounded p-3">
            <p className="text-sm text-gray-500">Rol</p>
            <p>{user?.role || '-'}</p>
          </div>
          <div className="border rounded p-3">
            <p className="text-sm text-gray-500">Status</p>
            <p>{user?.is_active ? 'Aktiv' : 'Deaktiv'}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Şəxsi məlumatlar</TabsTrigger>
          <TabsTrigger value="role">Rol</TabsTrigger>
          <TabsTrigger value="security">Təhlükəsizlik</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="py-4">
          <PersonalTab 
            user={user} 
            isEditing={isEditing} 
          />
        </TabsContent>
        
        <TabsContent value="role" className="py-4">
          <RoleTab 
            roles={roleData.roles}
            regions={roleData.regions}
            sectors={roleData.sectors}
            schools={roleData.schools}
            isEditing={isEditing}
            user={user}
            currentUserRole={currentUserRole || ''}
            selectedRole={formData.role_id}
            selectedRegion={formData.region_id}
            selectedSector={formData.sector_id}
            selectedSchool={formData.school_id}
            onRoleChange={handleRoleChange}
            onRegionChange={(value) => handleInputChange({ target: { name: 'region_id', value } })}
            onSectorChange={(value) => handleInputChange({ target: { name: 'sector_id', value } })}
            onSchoolChange={(value) => handleInputChange({ target: { name: 'school_id', value } })}
          />
        </TabsContent>
        
        <TabsContent value="security" className="py-4">
          <SecurityTab isEditing={isEditing} />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={resetForm}
        >
          Təmizlə
        </Button>
        <Button 
          type="submit" 
          disabled={createUserMutation.isPending}
        >
          {createUserMutation.isPending ? 'Yüklənir...' : isEditing ? 'Yenilə' : 'Əlavə et'}
        </Button>
      </div>
    </form>
  );
};

export default UserModalContent;
