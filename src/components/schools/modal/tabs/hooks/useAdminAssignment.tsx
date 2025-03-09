
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { User } from '@/services/api/userService';
import { fetchAvailableAdmins, assignAdminToSchool, createNewAdmin, NewAdminForm } from '@/services/admin/adminService';
import { generateRandomPassword } from '@/utils/passwordUtils';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAssignment = (schoolId?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [newAdmin, setNewAdmin] = useState<NewAdminForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: generateRandomPassword()
  });
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);

  // Fetch both available admins and current school admin
  const loadAdminData = useCallback(async () => {
    if (!schoolId) return;
    
    setIsLoading(true);
    try {
      // Get available admins (not assigned to any school)
      const availableAdmins = await fetchAvailableAdmins(schoolId);
      setUsers(availableAdmins);
      
      // Also check if this school already has an admin
      const { data: roleData } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'school-admin')
        .single();
      
      if (!roleData) {
        console.error('School admin role not found');
        toast.error('Admin rolu tapılmadı');
        return;
      }
      
      const roleId = roleData.id;
      
      const { data: schoolAdmin, error } = await supabase
        .from('users')
        .select('*')
        .eq('school_id', schoolId)
        .eq('role_id', roleId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching current school admin:', error);
      }
        
      if (schoolAdmin) {
        setCurrentAdmin(schoolAdmin as User);
      } else {
        setCurrentAdmin(null);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Admin məlumatları yüklənərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Assign existing admin to school
  const handleAssignAdmin = async () => {
    if (!schoolId || !selectedUserId) return;
    
    setIsAssigning(true);
    try {
      const success = await assignAdminToSchool(schoolId, selectedUserId);
      if (success) {
        await loadAdminData();
      }
    } finally {
      setIsAssigning(false);
    }
  };

  // Create new admin and assign to school
  const handleCreateAdmin = async () => {
    if (!schoolId) return;
    
    setIsAssigning(true);
    try {
      const success = await createNewAdmin(schoolId, newAdmin);
      
      if (success) {
        // Show toast with login details
        toast.success(
          <div className="space-y-2">
            <p>Admin uğurla yaradıldı və məktəbə təyin edildi</p>
            <div className="text-xs bg-gray-100 p-2 rounded">
              <p><strong>Giriş məlumatları:</strong></p>
              <p>Email: {newAdmin.email}</p>
              <p>Şifrə: {newAdmin.password}</p>
            </div>
            <p className="text-xs text-gray-500">
              Bu məlumatları təhlükəsiz şəkildə saxlayın
            </p>
          </div>,
          { duration: 10000 }
        );
        
        // Reset form
        setNewAdmin({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: generateRandomPassword()
        });
        
        await loadAdminData();
      }
    } finally {
      setIsAssigning(false);
    }
  };

  return {
    users,
    isLoading,
    selectedUserId,
    setSelectedUserId,
    isAssigning,
    newAdmin,
    setNewAdmin,
    handleAssignAdmin,
    handleCreateAdmin,
    generateRandomPassword,
    currentAdmin
  };
};
