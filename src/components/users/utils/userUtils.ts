
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/lib/supabase/types/user';
import { UserRole } from '@/types/common';

export const getUserDisplayName = (user: User): string => {
  if (!user) return '-';
  return `${user.first_name} ${user.last_name}`;
};

export const getUserInitials = (user: User): string => {
  if (!user) return '';
  return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
};

export const getUserStatusColor = (isActive: boolean): string => {
  return isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100';
};

export const getUserStatusText = (isActive: boolean): string => {
  return isActive ? 'Aktiv' : 'Deaktiv';
};

export const getUserStatusBadge = (user: User): JSX.Element => {
  return React.createElement(Badge, { 
    className: getUserStatusColor(user.is_active) 
  }, getUserStatusText(user.is_active));
};

export const getUserRoleName = (user: User): string => {
  const role = user.role || user.userRole || '';
  
  if (typeof role === 'string') {
    switch (role) {
      case 'super-admin':
      case 'superadmin':
        return 'Super Admin';
      case 'region-admin':
        return 'Region Admin';
      case 'sector-admin':
        return 'Sektor Admin';
      case 'school-admin':
        return 'Məktəb Admin';
      default:
        return role || 'İstifadəçi';
    }
  }
  
  return 'İstifadəçi';
};

export const getUserRoleBadgeColor = (user: User): string => {
  const role = user.role || user.userRole || '';
  
  if (typeof role === 'string') {
    switch (role) {
      case 'super-admin':
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'region-admin':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'sector-admin':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'school-admin':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  }
  
  return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
};

export const getUserEntity = (user: User): string => {
  if (!user) return '-';
  
  if (user.school) return `${user.school} (Məktəb)`;
  if (user.sector) return `${user.sector} (Sektor)`;
  if (user.region) return `${user.region} (Region)`;
  
  return '-';
};

export const getUserDisplayEntity = (user: User): string => {
  if (!user) return '-';
  
  if (user.school) return user.school;
  if (user.sector) return user.sector;
  if (user.region) return user.region;
  
  return '-';
};
