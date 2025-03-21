
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, type UserFormValues } from './UserFormSchema';
import { User } from '@/supabase/types';
import { PersonalTab } from './tabs/PersonalTab';
import { RoleTab } from './role/RoleTab';
import { SecurityTab } from './tabs/SecurityTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganizationData } from '../hooks/useOrganizationData';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface UserModalContentProps {
  user?: User;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const UserModalContent: React.FC<UserModalContentProps> = ({
  user,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const { 
    roles, 
    regions, 
    sectors, 
    schools, 
    isLoading, 
    regionId, 
    setRegionId, 
    sectorId, 
    setSectorId, 
    schoolId, 
    setSchoolId 
  } = useOrganizationData();

  // Get current user role from auth
  const [currentUserRole, setCurrentUserRole] = useState('unknown');
  
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // This would normally be fetched from your auth system
        // For now, let's assume the current user is a super admin
        setCurrentUserRole('superadmin');
      } catch (error) {
        console.error('Error fetching user role:', error);
        toast.error('Cari istifadəçi rolu alınarkən xəta baş verdi');
      }
    };
    
    fetchUserRole();
  }, []);

  // Initialize the form with user data if provided
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user ? {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || '',
      utis_code: user.utis_code || '',
      role_id: user.role_id,
      region_id: user.region_id || '',
      sector_id: user.sector_id || '',
      school_id: user.school_id || '',
      is_active: user.is_active,
      password: '' // Don't prefill password
    } : {
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      utis_code: '',
      role_id: '',
      region_id: '',
      sector_id: '',
      school_id: '',
      is_active: true,
      password: ''
    }
  });

  // Find role by ID for display purposes
  const getRoleById = (roleId: string) => {
    return roles.find(role => role.id === roleId);
  };

  // When form is submitted
  const handleSubmit = (values: UserFormValues) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Şəxsi məlumatlar</TabsTrigger>
          <TabsTrigger value="role">Rol və İcazələr</TabsTrigger>
          <TabsTrigger value="security">Təhlükəsizlik</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4 mt-6">
          <PersonalTab form={form} />
        </TabsContent>
        
        <TabsContent value="role" className="space-y-4 mt-6">
          <RoleTab 
            roles={roles}
            regions={regions}
            sectors={sectors}
            schools={schools}
            isEditing={!!user}
            user={user}
            currentUserRole={currentUserRole}
            selectedRole={form.watch('role_id')}
            selectedRegion={form.watch('region_id')}
            selectedSector={form.watch('sector_id')}
            selectedSchool={form.watch('school_id')}
            onRoleChange={(value) => form.setValue('role_id', value)}
            onRegionChange={(value) => {
              form.setValue('region_id', value);
              form.setValue('sector_id', '');
              form.setValue('school_id', '');
              setRegionId(value);
            }}
            onSectorChange={(value) => {
              form.setValue('sector_id', value);
              form.setValue('school_id', '');
              setSectorId(value);
            }}
            onSchoolChange={(value) => {
              form.setValue('school_id', value);
              setSchoolId(value);
            }}
          />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 mt-6">
          <SecurityTab form={form} isEditing={!!user} />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Ləğv et
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Gözləyin...' : user ? 'Yenilə' : 'Əlavə et'}
        </Button>
      </div>
    </form>
  );
};
