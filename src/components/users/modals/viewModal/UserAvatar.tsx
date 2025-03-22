
import React from 'react';
import { User } from '@/lib/supabase/types/user';
import { getUserRoleName } from '../../utils/userUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  const getInitials = () => {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-16 w-16';
      case 'md':
      default:
        return 'h-12 w-12';
    }
  };

  const roleName = getUserRoleName(user);
  
  const getRoleColorClass = () => {
    switch (roleName.toLowerCase()) {
      case 'super-admin':
      case 'superadmin':
        return 'bg-purple-500';
      case 'region-admin':
      case 'regionadmin':
        return 'bg-blue-500';
      case 'sector-admin':
      case 'sectoradmin':
        return 'bg-green-500';
      case 'school-admin':
      case 'schooladmin':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Avatar className={getSizeClass()}>
      <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
      <AvatarFallback className={getRoleColorClass()}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
