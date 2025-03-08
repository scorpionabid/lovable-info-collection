
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

  // Generate a secure random password with letters, numbers, and special characters
  function generateRandomPassword(length = 10) {
    // Ensure at least one of each required character type
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*';
    
    const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;
    
    // Start with one of each required character type
    let password = 
      upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length)) +
      lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length)) +
      numberChars.charAt(Math.floor(Math.random() * numberChars.length)) +
      specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    
    // Fill the rest with random characters
    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle the password to avoid predictable patterns
    return password.split('').sort(() => 0.5 - Math.random()).join('');
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
      
      // Get users who are school admins but aren't assigned to any school
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
        toast.error('Admin təyin edilmədi: ' + error.message);
        return;
      }
      
      // Fetch the user's data to show in confirmation message
      const assignedUser = await userService.getUserById(selectedUserId);
      
      // Get school name
      const { data: schoolData } = await supabase
        .from('schools')
        .select('name')
        .eq('id', schoolId)
        .single();
      
      const schoolName = schoolData?.name || 'Seçilmiş məktəb';
      
      toast.success(`${assignedUser.first_name} ${assignedUser.last_name} "${schoolName}" məktəbinə admin olaraq təyin edildi`);
      setSelectedUserId('');
      await fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error assigning admin:', error);
      toast.error('Admin təyin edilmədi: ' + (error as Error).message);
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

    // Add more password validation
    const hasUpperCase = /[A-Z]/.test(newAdmin.password);
    const hasLowerCase = /[a-z]/.test(newAdmin.password);
    const hasNumber = /[0-9]/.test(newAdmin.password);
    const hasSpecialChar = /[!@#$%^&*]/.test(newAdmin.password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)) {
      toast.error('Şifrə ən azı bir böyük hərf, bir kiçik hərf, bir rəqəm və bir xüsusi simvol daxil edilməlidir');
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

      // Get school details for confirmation message
      const { data: schoolData } = await supabase
        .from('schools')
        .select('name')
        .eq('id', schoolId)
        .single();
      
      const schoolName = schoolData?.name || 'Seçilmiş məktəb';

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
        .update({
          school_id: schoolId // Update the school_id field
        })
        .eq('id', authResult.user.id);

      if (error) {
        console.error('Error assigning school to admin:', error);
        toast.error('Admin məktəbə təyin edilmədi: ' + error.message);
        return;
      }
      
      // Send email notification (simulated)
      console.log('Sending email notification to:', newAdmin.email, {
        subject: 'İnfoLine Sistemində Admin Hesabı Yaradıldı',
        body: `Hörmətli ${newAdmin.firstName} ${newAdmin.lastName},
          
        Siz "${schoolName}" məktəbi üçün InforLine sistemində admin təyin edildiniz.
        Giriş məlumatlarınız:
        Email: ${newAdmin.email}
        Şifrə: ${newAdmin.password}
        
        İlk dəfə giriş etdikdən sonra şifrənizi dəyişməyi unutmayın.
        
        Hörmətlə,
        InforLine Komandası`
      });
      
      // Show success message with login details
      toast.success(
        <div>
          <p className="font-semibold">Yeni admin yaradıldı və məktəbə təyin edildi</p>
          <div className="mt-2">
            <p>Ad: {newAdmin.firstName} {newAdmin.lastName}</p>
            <p>Email: {newAdmin.email}</p>
            <p>Şifrə: {newAdmin.password}</p>
            <p>Məktəb: {schoolName}</p>
          </div>
        </div>,
        { duration: 8000 }
      );
      
      // Reset form
      setNewAdmin({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: generateRandomPassword()
      });
      
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
    handleCreateAdmin,
    generateRandomPassword
  };
};
