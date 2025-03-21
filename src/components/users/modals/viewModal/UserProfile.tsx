
import React from 'react';
import { User } from '@/supabase/types';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  const isActive = user.is_active;
  
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-24 w-24 mb-2">
            <AvatarImage src={user.avatar_url || ''} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-semibold mt-2">
            {user.first_name} {user.last_name}
          </h3>
          
          <p className="text-gray-600 mt-1">{user.email}</p>
          
          <Badge className={isActive ? 'bg-green-500 mt-2' : 'bg-red-500 mt-2'}>
            {isActive ? 'Aktiv' : 'Deaktiv'}
          </Badge>
        </div>
        
        <div className="text-sm text-left space-y-2">
          {user.phone && (
            <div className="flex justify-between">
              <span className="text-gray-500">Telefon:</span>
              <span>{user.phone}</span>
            </div>
          )}
          
          {user.utis_code && (
            <div className="flex justify-between">
              <span className="text-gray-500">UTİS kodu:</span>
              <span>{user.utis_code}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-500">Qeydiyyat tarixi:</span>
            <span>{formatDate(user.created_at || '')}</span>
          </div>
          
          {user.last_login && (
            <div className="flex justify-between">
              <span className="text-gray-500">Son giriş:</span>
              <span>{formatDate(user.last_login)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
