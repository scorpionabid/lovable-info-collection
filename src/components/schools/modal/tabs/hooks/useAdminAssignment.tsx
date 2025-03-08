
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/services/api/userService';
import userService from '@/services/api/userService';
import authService from '@/services/api/authService';

export interface NewAdminFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
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
    phone: '',
    password: generateRandomPassword(), // Generate a default password
  });

  // Generate a random password with letters, numbers, and special characters
  function generateRandomPassword(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Fetch unassigned users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // First get the school admin role ID
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'school-admin')
        .single();
        
      if (roleError) {
        console.error('Error fetching role:', roleError);
        toast.error('Rol məlumatları yüklənmədi');
        return;
      }
      
      if (!roleData || !roleData.id) {
        console.error('Role ID not found');
        toast.error('Rol ID tapılmadı');
        return;
      }
      
      const schoolAdminRoleId = roleData.id;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role_id', schoolAdminRoleId)
        .is('school_id', null)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('İstifadəçilər yüklənmədi');
        return;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('İstifadəçilər yüklənmədi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (schoolId) {
      fetchUsers();
    }
  }, [fetchUsers, schoolId]);

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

      if (error) {
        console.error('Error assigning admin:', error);
        toast.error('Admin təyin edilmədi');
        return;
      }
      
      // Fetch the user's data to show in confirmation message
      const assignedUser = await userService.getUserById(selectedUserId);
      
      toast.success(`${assignedUser.first_name} ${assignedUser.last_name} məktəbə admin olaraq təyin edildi`);
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

    // Password validation
    if (!newAdmin.password || newAdmin.password.length < 8) {
      toast.error('Şifrə ən azı 8 simvol olmalıdır');
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
        
      if (roleError) {
        console.error('Error fetching role:', roleError);
        toast.error('Rol məlumatları yüklənmədi');
        return;
      }
      
      if (!roleData || !roleData.id) {
        console.error('Role ID not found');
        toast.error('Rol ID tapılmadı');
        return;
      }

      const schoolAdminRoleId = roleData.id;

      // Create auth user first
      const authResult = await authService.register({
        email: newAdmin.email,
        password: newAdmin.password,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        role: schoolAdminRoleId
      });

      if (!authResult.user) {
        throw new Error('İstifadəçi yaradılmadı');
      }

      // Create user in database with school_id already assigned
      const { error } = await supabase
        .from('users')
        .insert({
          id: authResult.user.id,
          first_name: newAdmin.firstName,
          last_name: newAdmin.lastName,
          email: newAdmin.email,
          phone: newAdmin.phone,
          role_id: schoolAdminRoleId,
          school_id: schoolId,
          is_active: true
        });

      if (error) {
        console.error('Error creating admin:', error);
        toast.error('Admin yaradılmadı: ' + error.message);
        return;
      }
      
      // Get school details for confirmation message
      const { data: schoolData } = await supabase
        .from('schools')
        .select('name')
        .eq('id', schoolId)
        .single();
      
      const schoolName = schoolData?.name || 'Seçilmiş məktəb';
      
      // Show success message with login details
      toast.success(
        <div>
          <p><strong>Yeni admin yaradıldı və məktəbə təyin edildi</strong></p>
          <p>Ad: {newAdmin.firstName} {newAdmin.lastName}</p>
          <p>Email: {newAdmin.email}</p>
          <p>Şifrə: {newAdmin.password}</p>
          <p>Məktəb: {schoolName}</p>
        </div>
      );
      
      // Reset form
      setNewAdmin({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: generateRandomPassword()
      });
      
      // Send notification email - this would be implemented in a real application
      // We're just simulating this here since we don't have email integration set up
      console.log('Sending notification email to:', newAdmin.email);
      
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Admin yaradılmadı: ' + (error as Error).message);
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
