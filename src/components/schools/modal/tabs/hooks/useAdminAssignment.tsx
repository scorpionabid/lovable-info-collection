
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { type User } from '@/services/userService/types';
import { generateRandomPassword } from '@/utils/passwordUtils';
import { 
  useAdminFetching 
} from './utils/adminFetchUtils';
import { 
  assignAdminToSchool, 
  createAdminAuthUser, 
  createAdminDbRecord 
} from './utils/adminAssignUtils';

export interface NewAdminForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export const useAdminAssignment = (schoolId?: string) => {
  const [users, setUsers] = useState<User[]>([]);
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
  
  // Use the fetching hook
  const { loadAdminData, isLoading } = useAdminFetching(schoolId);

  // Load data when the component mounts or schoolId changes
  useEffect(() => {
    if (!schoolId) return;
    
    const fetchData = async () => {
      const { users: fetchedUsers, currentAdmin: fetchedAdmin } = await loadAdminData();
      setUsers(fetchedUsers);
      setCurrentAdmin(fetchedAdmin);
      
      // Reset selected user when loading new data
      setSelectedUserId('');
    };
    
    fetchData();
  }, [schoolId, loadAdminData]);

  // Assign existing admin to school
  const handleAssignAdmin = async () => {
    if (!schoolId || !selectedUserId) {
      toast.error('Məktəb ID və ya istifadəçi seçilməyib');
      return false;
    }
    
    setIsAssigning(true);
    try {
      const success = await assignAdminToSchool(schoolId, selectedUserId);
      
      if (success) {
        // Reload data to update UI
        const { users: updatedUsers, currentAdmin: updatedAdmin } = await loadAdminData();
        setUsers(updatedUsers);
        setCurrentAdmin(updatedAdmin);
        setSelectedUserId('');
      }
      
      return success;
    } finally {
      setIsAssigning(false);
    }
  };

  // Create new admin and assign to school
  const handleCreateAdmin = async (schoolId: string, adminData: NewAdminForm) => {
    if (!schoolId || !adminData.email || !adminData.firstName || !adminData.lastName) {
      toast.error('Bütün məcburi sahələri doldurun');
      return false;
    }
    
    setIsAssigning(true);
    try {
      // Create auth user
      const { userId, error: authError } = await createAdminAuthUser(
        adminData.email,
        adminData.password,
        adminData.firstName,
        adminData.lastName
      );
      
      if (authError) {
        toast.error(authError);
        return false;
      }
      
      if (!userId) {
        toast.error('İstifadəçi ID-si yaradıla bilmədi');
        return false;
      }
      
      // Create database record
      const success = await createAdminDbRecord(
        userId,
        adminData.email,
        adminData.firstName,
        adminData.lastName,
        adminData.phone,
        schoolId
      );
      
      if (success) {
        toast.success('Admin uğurla yaradıldı və məktəbə təyin edildi');
        
        // Reload data to update UI
        const { users: updatedUsers, currentAdmin: updatedAdmin } = await loadAdminData();
        setUsers(updatedUsers);
        setCurrentAdmin(updatedAdmin);
        
        // Reset form
        setNewAdmin({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: generateRandomPassword()
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error in admin creation:', error);
      toast.error(`Admin yaradılarkən xəta baş verdi: ${(error as Error).message}`);
      return false;
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
    currentAdmin,
    refreshData: async () => {
      if (!schoolId) return;
      const { users: fetchedUsers, currentAdmin: fetchedAdmin } = await loadAdminData();
      setUsers(fetchedUsers);
      setCurrentAdmin(fetchedAdmin);
    }
  };
};
