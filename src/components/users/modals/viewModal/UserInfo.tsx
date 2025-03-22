
import React from 'react';
import { User } from '@/lib/supabase/types/user';
import { UserAvatar } from './UserAvatar';
import { UserDetails } from './UserDetails';

interface UserInfoProps {
  user: User;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="flex items-center space-x-4">
      <UserAvatar user={user} size="lg" />
      <UserDetails user={user} />
    </div>
  );
};

export default UserInfo;
