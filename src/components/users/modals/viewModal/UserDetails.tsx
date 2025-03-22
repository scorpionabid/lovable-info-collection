
import React from 'react';
import { User } from '@/lib/supabase/types/user';
import { getUserRoleName } from '../../utils/userUtils';

interface UserDetailsProps {
  user: User;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const fullName = `${user.first_name} ${user.last_name}`;
  const roleName = getUserRoleName(user);

  return (
    <div>
      <h2 className="text-xl font-bold">{fullName}</h2>
      <p className="text-gray-500">{user.email}</p>
      <div className="mt-1 flex items-center">
        <span className="text-sm text-gray-600">{roleName}</span>
        {user.utis_code && (
          <>
            <span className="mx-2">•</span>
            <span className="text-sm text-gray-600">UTIS: {user.utis_code}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
