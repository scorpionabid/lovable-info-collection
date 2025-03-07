
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/services/api/userService';

export interface NewAdminFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const useAdminAssignment = (schoolId?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [newAdmin, setNewAdmin] = useState<NewAdminFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Fetch unassigned users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role_id', (await supabase.from('roles').select('id').eq('name', 'school-admin').single()).data?.id)
        .is('school_id', null)
        .eq('is_active', true);

      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('İstifadəçilər yüklənmədi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Assign an existing admin to the school
  const handleAssignAdmin = async () => {
    if (!schoolId || !selectedUserId) {
      toast.error('Məktəb və ya istifadəçi seçilməyib');
      return;
    }

    try {
      setIsAssigning(true);
      
      // Update user record to assign them to this school
      const { error } = await supabase
        .from('users')
        .update({ school_id: schoolId })
        .eq('id', selectedUserId);

      if (error) throw error;
      
      toast.success('Admin məktəbə təyin edildi');
      setSelectedUserId('');
      await fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error assigning admin:', error);
      toast.error('Admin təyin edilmədi');
    } finally {
      setIsAssigning(false);
    }
  };

  // Create a new admin and assign to the school
  const handleCreateAdmin = async () => {
    if (!schoolId) {
      toast.error('Məktəb seçilməyib');
      return;
    }

    if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email) {
      toast.error('Zəhmət olmasa bütün məcburi sahələri doldurun');
      return;
    }

    try {
      setIsAssigning(true);
      
      // First check if user with this email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', newAdmin.email)
        .single();
        
      if (existingUser) {
        toast.error('Bu email ilə istifadəçi artıq mövcuddur');
        return;
      }
      
      // Get the school-admin role ID
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'school-admin')
        .single();
        
      if (roleError) throw roleError;

      // Generate a UUID for the new user
      const userId = crypto.randomUUID();
      
      // Create new user
      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          first_name: newAdmin.firstName,
          last_name: newAdmin.lastName,
          email: newAdmin.email,
          phone: newAdmin.phone,
          role_id: roleData?.id,
          school_id: schoolId,
          is_active: true
        });

      if (error) throw error;
      
      // Send invitation email (in a real app)
      // For now we'll just show a success message
      
      toast.success('Yeni admin yaradıldı və məktəbə təyin edildi');
      
      // Reset form
      setNewAdmin({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });
      
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Admin yaradılmadı');
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
    handleCreateAdmin
  };
};
