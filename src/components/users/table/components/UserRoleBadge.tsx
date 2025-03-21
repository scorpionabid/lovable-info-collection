import React from 'react';
import { Badge } from "@/components/ui/badge";
import { User } from "@/supabase/types";

interface UserRoleBadgeProps {
  user: User;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ user }) => {
  // Get role name from role relation if available
  const roleName = user.roles?.name || getRoleNameFromId(user.role_id);
  
  // Determine badge color based on role
  const getBadgeVariant = () => {
    if (!roleName) return 'default';
    
    const role = roleName.toLowerCase();
    
    if (role.includes('super')) return 'destructive';
    if (role.includes('region')) return 'blue';
    if (role.includes('sector')) return 'green';
    if (role.includes('school')) return 'yellow';
    
    return 'default';
  };
  
  // Get a human-readable role name
  const getDisplayRoleName = () => {
    if (!roleName) return 'Unknown Role';
    
    // If role comes from the roles relationship, use it directly
    if (user.roles?.name) {
      return user.roles.name;
    }
    
    // Otherwise try to make the role ID more readable
    switch (roleName.toLowerCase()) {
      case 'superadmin':
        return 'Super Admin';
      case 'regionadmin':
        return 'Region Admin';
      case 'sectoradmin':
        return 'Sector Admin';
      case 'schooladmin':
        return 'School Admin';
      default:
        return roleName;
    }
  };
  
  return (
    <Badge variant={getBadgeVariant() as any}>
      {getDisplayRoleName()}
    </Badge>
  );
};

// Helper function to get role name from ID when relationship isn't loaded
function getRoleNameFromId(roleId: string): string {
  // This is a simple mapping - in a real app this would come from a mapping or API
  const roleMap: Record<string, string> = {
    '1': 'SuperAdmin',
    '2': 'RegionAdmin',
    '3': 'SectorAdmin',
    '4': 'SchoolAdmin',
  };
  
  return roleMap[roleId] || 'Unknown Role';
}
