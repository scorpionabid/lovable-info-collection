
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import userService, { User, UserFilters } from "@/services/api/userService";
import authService from "@/services/api/authService";

export const useAdminAssignment = (schoolId?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadUnassignedUsers = async () => {
      try {
        setIsLoading(true);
        // Get users that are not assigned to a school but have school-admin role
        const rolesResponse = await userService.getRoles();
        const schoolAdminRole = rolesResponse.find(role => role.name === 'school-admin');
        
        if (schoolAdminRole) {
          // Create a proper UserFilters object with the correct status type
          const filters: UserFilters = {
            role: 'school-admin',
            school_id: undefined,
            status: 'active' // Now correctly typed as one of the allowed values
          };
          const unassignedUsers = await userService.getUsers(filters);
          setUsers(unassignedUsers);
        }
      } catch (error) {
        console.error('Error loading unassigned users:', error);
        toast({
          title: 'Xəta',
          description: 'İstifadəçilər yüklənərkən xəta baş verdi',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (schoolId) {
      loadUnassignedUsers();
    }
  }, [schoolId, toast]);

  const handleAssignAdmin = async () => {
    if (!selectedUserId || !schoolId) return;

    try {
      setIsAssigning(true);
      await userService.updateUser(selectedUserId, { school_id: schoolId });
      
      toast({
        title: 'Uğurlu əməliyyat',
        description: 'Admin məktəbə təyin edildi',
      });

      // Refresh the list
      setSelectedUserId('');
      setUsers(users.filter(user => user.id !== selectedUserId));
    } catch (error) {
      console.error('Error assigning admin:', error);
      toast({
        title: 'Xəta',
        description: 'Admin təyin edilərkən xəta baş verdi',
        variant: 'destructive'
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!schoolId || !newAdmin.email || !newAdmin.firstName || !newAdmin.lastName) {
      toast({
        title: 'Xəta',
        description: 'Zəhmət olmasa bütün məcburi sahələri doldurun',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsAssigning(true);
      // First, get the school-admin role ID
      const rolesResponse = await userService.getRoles();
      const schoolAdminRole = rolesResponse.find(role => role.name === 'school-admin');
      
      if (!schoolAdminRole) {
        throw new Error('School admin role not found');
      }

      // Create a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Create the user with school-admin role and assign to this school
      const userData: Omit<User, 'id'> = {
        email: newAdmin.email,
        first_name: newAdmin.firstName,
        last_name: newAdmin.lastName,
        phone: newAdmin.phone,
        role_id: schoolAdminRole.id,
        school_id: schoolId,
        is_active: true,
        utis_code: `SC${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
      };
      
      // Create the user in the database
      await userService.createUser(userData);
      
      // Also create auth user with password
      await authService.register({
        email: newAdmin.email,
        password: tempPassword,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        role: schoolAdminRole.id
      });
      
      toast({
        title: 'Uğurlu əməliyyat',
        description: 'Yeni admin yaradıldı və məktəbə təyin edildi',
      });
      
      // Reset form
      setNewAdmin({ firstName: '', lastName: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: 'Xəta',
        description: 'Admin yaradılarkən xəta baş verdi',
        variant: 'destructive'
      });
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
