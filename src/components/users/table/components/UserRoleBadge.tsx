
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
    
    switch (roleName) {
      case 'super-admin':
      case 'superadmin':
        return 'SuperAdmin';
      case 'region-admin':
        return 'Region Admin';
      case 'sector-admin':
        return 'Sektor Admin';
      case 'school-admin':
        return 'Məktəb Admin';
      default:
        return roleName;
    }
  };
  
  const getRoleColor = (roleName: string | undefined) => {
    if (!roleName) return 'bg-gray-100 text-gray-800';
    
    switch (roleName) {
      case 'super-admin':
      case 'superadmin':
        return 'bg-red-100 text-red-800';
      case 'region-admin':
        return 'bg-blue-100 text-blue-800';
      case 'sector-admin':
        return 'bg-green-100 text-green-800';
      case 'school-admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={`${getRoleColor(user.roles?.name)} font-normal`}>
      {getRoleName(user)}
    </Badge>
  );
};
