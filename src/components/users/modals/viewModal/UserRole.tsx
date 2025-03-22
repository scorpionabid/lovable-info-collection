
import React from 'react';
import { User } from '@/lib/supabase/types/user';
import { Badge } from '@/components/ui/badge';
import { getUserRoleBadgeColor, getUserRoleName } from '../../utils/userUtils';

interface UserRoleProps {
  user: User;
}

export const UserRole: React.FC<UserRoleProps> = ({ user }) => {
  const roleName = getUserRoleName(user);
  const badgeColor = getUserRoleBadgeColor(user);

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Role</h4>
      <Badge variant="outline" className={badgeColor}>
        {roleName}
      </Badge>
    </div>
  );
};

export default UserRole;
