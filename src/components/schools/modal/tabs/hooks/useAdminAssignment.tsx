
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/services/api/userService';

interface NewAdminForm {
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
  const [newAdmin, setNewAdmin] = useState<NewAdminForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: generateRandomPassword()
  });

  // Fetch available admins (users with admin role who aren't assigned to a school yet)
  const loadAvailableAdmins = useCallback(async () => {
    if (!schoolId) return;
    
    setIsLoading(true);
    try {
      const { data: roleData } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'school-admin')
        .single();
      
      if (!roleData) {
        throw new Error('School admin role not found');
      }
      
      const roleId = roleData.id;
      
      // Get users with school-admin role who don't have a school assigned yet
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role_id', roleId)
        .is('school_id', null);
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading available admins:', error);
      toast.error('Admin siyahısı yüklənərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    loadAvailableAdmins();
  }, [loadAvailableAdmins]);

  // Generate a random secure password
  function generateRandomPassword(): string {
    const upperChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const specialChars = '!@#$%^&*';
    
    const getRandomChar = (charset: string) => charset.charAt(Math.floor(Math.random() * charset.length));
    
    // Ensure we have at least one of each required character type
    let password = 
      getRandomChar(upperChars) +
      getRandomChar(lowerChars) +
      getRandomChar(numbers) +
      getRandomChar(specialChars);
    
    // Add additional random characters to reach desired length (minimum 8)
    const allChars = upperChars + lowerChars + numbers + specialChars;
    while (password.length < 10) {
      password += getRandomChar(allChars);
    }
    
    // Shuffle the password to avoid predictable patterns
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  // Assign existing admin to school
  const handleAssignAdmin = async () => {
    if (!schoolId || !selectedUserId) return;
    
    setIsAssigning(true);
    try {
      // Update the user record to assign them to this school
      const { error } = await supabase
        .from('users')
        .update({ school_id: schoolId })
        .eq('id', selectedUserId);
      
      if (error) throw error;
      
      toast.success('Admin məktəbə uğurla təyin edildi');
      await loadAvailableAdmins();
    } catch (error) {
      console.error('Error assigning admin:', error);
      toast.error('Admin təyin edilərkən xəta baş verdi');
    } finally {
      setIsAssigning(false);
    }
  };

  // Create new admin and assign to school
  const handleCreateAdmin = async () => {
    if (!schoolId) return;
    
    setIsAssigning(true);
    try {
      // 1. Get role ID for school-admin
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'school-admin')
        .single();
      
      if (roleError) throw roleError;
      
      const roleId = roleData.id;
      
      // 2. Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password || generateRandomPassword(),
        options: {
          data: {
            first_name: newAdmin.firstName,
            last_name: newAdmin.lastName
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('İstifadəçi yaradıla bilmədi');
      }
      
      // 3. Insert user data into users table with school_id
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          first_name: newAdmin.firstName,
          last_name: newAdmin.lastName,
          email: newAdmin.email,
          phone: newAdmin.phone,
          role_id: roleId,
          school_id: schoolId,
          is_active: true
        });
      
      if (insertError) throw insertError;
      
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
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast.error(`Admin yaradılarkən xəta baş verdi: ${error.message || 'Naməlum xəta'}`);
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
