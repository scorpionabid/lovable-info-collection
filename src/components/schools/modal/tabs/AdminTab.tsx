
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import userService from "@/services/api/userService";

interface AdminTabProps {
  schoolId?: string;
}

export const AdminTab = ({ schoolId }: AdminTabProps) => {
  const [users, setUsers] = useState<any[]>([]);
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
        const { data: roleData } = await userService.getRoles();
        const schoolAdminRole = roleData.find(role => role.name === 'school-admin');
        
        if (schoolAdminRole) {
          const filters = {
            roleId: schoolAdminRole.id,
            unassignedOnly: true
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
      const { data: roleData } = await userService.getRoles();
      const schoolAdminRole = roleData.find(role => role.name === 'school-admin');
      
      if (!schoolAdminRole) {
        throw new Error('School admin role not found');
      }

      // Create a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Create the user with school-admin role and assign to this school
      const newUser = await userService.createUser({
        email: newAdmin.email,
        first_name: newAdmin.firstName,
        last_name: newAdmin.lastName,
        phone: newAdmin.phone,
        role_id: schoolAdminRole.id,
        school_id: schoolId,
        is_active: true,
        password: tempPassword
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-infoline-dark-gray block">
          Admin seçin
        </label>
        <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Yüklənir..." : "Mövcud istifadəçini seçin"} />
          </SelectTrigger>
          <SelectContent>
            {users.length > 0 ? (
              users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>Təyin edilməmiş admin yoxdur</SelectItem>
            )}
          </SelectContent>
        </Select>
        
        <Button 
          className="w-full mt-2" 
          onClick={handleAssignAdmin} 
          disabled={!selectedUserId || isAssigning}
        >
          {isAssigning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gözləyin...
            </>
          ) : 'Təyin et'}
        </Button>
      </div>
      
      <div className="flex items-center">
        <div className="flex-grow border-t border-infoline-light-gray"></div>
        <span className="px-4 text-sm text-infoline-dark-gray">və ya</span>
        <div className="flex-grow border-t border-infoline-light-gray"></div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-infoline-dark-gray">Yeni admin yarat</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-infoline-dark-gray block">
              Ad <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="Adı daxil edin" 
              value={newAdmin.firstName} 
              onChange={(e) => setNewAdmin({...newAdmin, firstName: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-infoline-dark-gray block">
              Soyad <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="Soyadı daxil edin" 
              value={newAdmin.lastName} 
              onChange={(e) => setNewAdmin({...newAdmin, lastName: e.target.value})}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-infoline-dark-gray block">
              E-poçt <span className="text-red-500">*</span>
            </label>
            <Input 
              type="email" 
              placeholder="E-poçt ünvanını daxil edin" 
              value={newAdmin.email} 
              onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-infoline-dark-gray block">
              Telefon
            </label>
            <Input 
              placeholder="Telefon nömrəsini daxil edin" 
              value={newAdmin.phone} 
              onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
            />
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleCreateAdmin} 
          disabled={isAssigning}
        >
          {isAssigning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gözləyin...
            </>
          ) : 'Yarat və Təyin et'}
        </Button>
      </div>
    </div>
  );
};
