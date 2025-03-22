
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/supabase/types/user';
import { getRoleName, getRoleColorClass } from '@/lib/utils';

interface UserRoleBadgeProps {
  user: User;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ user }) => {
  // Get the role name - support both 'role' and legacy 'roles' property
  const roleValue = user.role || user.roles || '';
  const roleName = getRoleName(roleValue);
  
  // Get appropriate color class for the role
  const colorClass = getRoleColorClass(roleName);
  
  return (
    <Badge className={colorClass} variant="outline">
      {roleName || 'User'}
    </Badge>
  );
};
