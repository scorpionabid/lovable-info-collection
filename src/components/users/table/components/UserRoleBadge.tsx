
import { Badge } from "@/components/ui/badge";
import { User } from "@/services/api/userService";
import { UserRole } from "@/contexts/AuthContext";

interface UserRoleBadgeProps {
  user: User;
}

export const UserRoleBadge = ({ user }: UserRoleBadgeProps) => {
  const getRoleName = (user: User) => {
    // Try to get role name from roles relationship first
    const roleName = user.roles?.name || '';
    if (!roleName) return 'Rol təyin edilməyib';
    
    const normalizedRole = roleName.toLowerCase();
    
    if (normalizedRole.includes('super')) return 'SuperAdmin';
    if (normalizedRole.includes('region')) return 'Region Admin';
    if (normalizedRole.includes('sector')) return 'Sektor Admin';
    if (normalizedRole.includes('school')) return 'Məktəb Admin';
    
    return roleName;
  };
  
  const getRoleColor = (roleName: string | undefined) => {
    if (!roleName) return 'bg-gray-100 text-gray-800';
    
    const normalizedRole = (roleName || '').toLowerCase();
    
    if (normalizedRole.includes('super')) return 'bg-red-100 text-red-800';
    if (normalizedRole.includes('region')) return 'bg-blue-100 text-blue-800';
    if (normalizedRole.includes('sector')) return 'bg-green-100 text-green-800';
    if (normalizedRole.includes('school')) return 'bg-purple-100 text-purple-800';
    
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Badge className={`${getRoleColor(user.roles?.name)} font-normal`}>
      {getRoleName(user)}
    </Badge>
  );
};
