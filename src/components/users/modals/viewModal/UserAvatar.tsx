
import React from 'react';
import { User } from '@/supabase/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  // Get initials from user's name
  const getInitials = () => {
    if (!user) return '??';
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  };

  // Get background color based on user role
  const getBackgroundColor = () => {
    const roleName = user.roles?.name?.toLowerCase() || '';
    
    if (roleName.includes('super')) return 'bg-purple-500';
    if (roleName.includes('region')) return 'bg-blue-500';
    if (roleName.includes('sector')) return 'bg-green-500';
    if (roleName.includes('school')) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  // Determine size class
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8 text-xs';
      case 'lg': return 'h-16 w-16 text-xl';
      case 'xl': return 'h-24 w-24 text-3xl';
      case 'md':
      default: return 'h-12 w-12 text-base';
    }
  };

  return (
    <Avatar className={`${getSizeClass()}`}>
      <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
      <AvatarFallback className={`${getBackgroundColor()} text-white font-medium`}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};
