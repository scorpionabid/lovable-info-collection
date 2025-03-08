
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { User } from '@/services/api/userService';
import { fetchAvailableAdmins, assignAdminToSchool, createNewAdmin, NewAdminForm } from '@/services/admin/adminService';
import { generateRandomPassword } from '@/utils/passwordUtils';

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

  // Fetch available admins
  const loadAvailableAdmins = useCallback(async () => {
    if (!schoolId) return;
    
    setIsLoading(true);
    try {
      const data = await fetchAvailableAdmins(schoolId);
      setUsers(data);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    loadAvailableAdmins();
  }, [loadAvailableAdmins]);

  // Assign existing admin to school
  const handleAssignAdmin = async () => {
    if (!schoolId || !selectedUserId) return;
    
    setIsAssigning(true);
    try {
      const success = await assignAdminToSchool(schoolId, selectedUserId);
      if (success) {
        await loadAvailableAdmins();
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
        
        await loadAvailableAdmins();
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
    generateRandomPassword
  };
};
