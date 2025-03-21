
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/supabase/types/user';

interface UserRoleBadgeProps {
  user: User;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ user }) => {
  // Get the role name - support both 'role' and legacy 'roles' property
  const roleName = user.role || user.roles || '';
  
  const getRoleColor = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'super-admin':
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'region-admin':
      case 'regionadmin':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'sector-admin':
      case 'sectoradmin':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'school-admin':
      case 'schooladmin':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  return (
    <Badge className={getRoleColor(roleName)} variant="outline">
      {roleName || 'User'}
    </Badge>
  );
};
