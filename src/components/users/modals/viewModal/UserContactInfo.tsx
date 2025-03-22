
import React from 'react';
import { User } from '@/lib/supabase/types/user';
import { Mail, Phone, Building } from 'lucide-react';

interface UserContactInfoProps {
  user: User;
}

export const UserContactInfo: React.FC<UserContactInfoProps> = ({ user }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start">
        <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium">Email</h4>
          <p>{user.email}</p>
        </div>
      </div>
      
      <div className="flex items-start">
        <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium">Phone</h4>
          <p>{user.phone || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="flex items-start">
        <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium">Organization</h4>
          <p>{user.school || user.sector || user.region || 'Global'}</p>
        </div>
      </div>
    </div>
  );
};

export default UserContactInfo;
