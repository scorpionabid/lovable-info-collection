
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { User } from '@/services/api/userService';
import { generateRandomPassword } from '@/utils/passwordUtils';
import { supabase } from '@/integrations/supabase/client';

export interface NewAdminForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
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
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);

  // Fetch both available admins and current school admin
  const loadAdminData = useCallback(async () => {
    if (!schoolId) return;
    
    setIsLoading(true);
    try {
      // Get school-admin role ID
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'school-admin')
        .single();
      
      if (roleError || !roleData) {
        console.error('School admin role not found:', roleError);
        toast.error('Admin rolu tapılmadı');
        setIsLoading(false);
        return;
      }
      
      const roleId = roleData.id;
      
      // Get available admins (not assigned to any school)
      const { data: availableAdmins, error: adminsError } = await supabase
        .from('users')
        .select('*')
        .eq('role_id', roleId)
        .is('school_id', null);
        
      if (adminsError) {
        console.error('Error fetching available admins:', adminsError);
        toast.error('Mövcud adminlər yüklənərkən xəta baş verdi');
      } else {
        setUsers(availableAdmins || []);
      }
      
      // Check if this school already has an admin
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
    if (!schoolId || !selectedUserId) {
      toast.error('Məktəb ID və ya istifadəçi seçilməyib');
      return;
    }
    
    setIsAssigning(true);
    try {
      // Update user record to associate with school
      const { error } = await supabase
        .from('users')
        .update({ school_id: schoolId })
        .eq('id', selectedUserId);
        
      if (error) {
        console.error('Error assigning admin to school:', error);
        toast.error('Admin təyin edilərkən xəta baş verdi');
        return false;
      }
      
      toast.success('Admin məktəbə uğurla təyin edildi');
      await loadAdminData();
      return true;
    } catch (error) {
      console.error('Error in admin assignment:', error);
      toast.error('Admin təyin edilərkən xəta baş verdi');
      return false;
    } finally {
      setIsAssigning(false);
    }
  };

  // Create new admin and assign to school
  const createNewAdmin = async (schoolId: string, adminData: NewAdminForm) => {
    if (!schoolId || !adminData.email || !adminData.firstName || !adminData.lastName) {
      toast.error('Bütün məcburi sahələri doldurun');
      return false;
    }
    
    setIsAssigning(true);
    try {
      // Get school-admin role ID
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'school-admin')
        .single();
        
      if (roleError || !roleData) {
        console.error('School admin role not found:', roleError);
        toast.error('Admin rolu tapılmadı');
        return false;
      }
      
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        options: {
          data: {
            first_name: adminData.firstName,
            last_name: adminData.lastName
          }
        }
      });
      
      if (authError && !authError.message.includes('already registered')) {
        console.error('Error creating auth user:', authError);
        toast.error(`Autentifikasiya xətası: ${authError.message}`);
        return false;
      }
      
      let userId: string;
      
      if (authError?.message.includes('already registered')) {
        // User already exists in auth, try to find their ID
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', adminData.email)
          .maybeSingle();
          
        if (userData?.id) {
          userId = userData.id;
        } else {
          toast.error('İstifadəçi mövcuddur, lakin bazada tapılmadı');
          return false;
        }
      } else if (authData?.user?.id) {
        userId = authData.user.id;
      } else {
        toast.error('İstifadəçi yaradıla bilmədi');
        return false;
      }
      
      // Create or update user record
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email: adminData.email,
          first_name: adminData.firstName,
          last_name: adminData.lastName,
          phone: adminData.phone || null,
          role_id: roleData.id,
          school_id: schoolId,
          is_active: true
        }, {
          onConflict: 'id'
        });
        
      if (userError) {
        console.error('Error creating user record:', userError);
        toast.error(`Verilənlər bazası xətası: ${userError.message}`);
        return false;
      }
      
      toast.success('Admin uğurla yaradıldı və məktəbə təyin edildi');
      await loadAdminData();
      return true;
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
    handleCreateAdmin: createNewAdmin,
    generateRandomPassword,
    currentAdmin
  };
};
