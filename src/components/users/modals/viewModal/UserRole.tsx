
import React from 'react';
import { User } from '@/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserRoleProps {
  user: User;
}

export const UserRole: React.FC<UserRoleProps> = ({ user }) => {
  // Get role name from user.role property or user.roles.name if available
  const roleName = user.role || (user.roles ? user.roles.name : '');
  let roleColor = 'bg-gray-500';
  
  // Set badge color based on role
  if (roleName) {
    const role = roleName.toLowerCase();
    if (role.includes('super')) {
      roleColor = 'bg-purple-500';
    } else if (role.includes('region')) {
      roleColor = 'bg-blue-500';
    } else if (role.includes('sector')) {
      roleColor = 'bg-green-500';
    } else if (role.includes('school')) {
      roleColor = 'bg-yellow-500 text-black';
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Rol Məlumatları</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Rol:</span>
            <Badge className={roleColor}>{roleName}</Badge>
          </div>
          
          {user.region && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Region:</span>
              <span>{user.region.name}</span>
            </div>
          )}
          
          {user.sector && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Sektor:</span>
              <span>{user.sector.name}</span>
            </div>
          )}
          
          {user.school && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Məktəb:</span>
              <span>{user.school.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
