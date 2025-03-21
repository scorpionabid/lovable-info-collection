
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/supabase/types/user';

interface UserRoleProps {
  user: User;
}

export const UserRole: React.FC<UserRoleProps> = ({ user }) => {
  // Support both 'role' and legacy 'roles' property
  const roleName = user.role || user.roles || '';
  
  const getRoleBadgeColor = (role: string): string => {
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
    <div className="space-y-4">
      <div className="border rounded-md p-4">
        <h3 className="font-semibold mb-3">User Role & Permissions</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Role</span>
            <Badge className={getRoleBadgeColor(roleName)} variant="outline">
              {roleName || 'User'}
            </Badge>
          </div>
          
          {user.region_id && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Region</span>
              <span className="text-sm">{user.region_id}</span>
            </div>
          )}
          
          {user.sector_id && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Sector</span>
              <span className="text-sm">{user.sector_id}</span>
            </div>
          )}
          
          {user.school_id && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">School</span>
              <span className="text-sm">{user.school_id}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
