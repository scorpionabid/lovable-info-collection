
import React from 'react';
import { User } from '@/lib/supabase/types';
import { format } from 'date-fns';

interface UserDetailsProps {
  user: User;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Get role display name
  const getRoleDisplay = () => {
    const roleName = user.roles?.name || 'Unknown';
    
    // Format the role name for display
    return roleName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="block text-sm font-medium text-gray-700">Full Name</span>
            <span className="block mt-1 text-sm text-gray-900">{user.first_name} {user.last_name}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Email</span>
            <span className="block mt-1 text-sm text-gray-900">{user.email}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Phone</span>
            <span className="block mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">UTIS Code</span>
            <span className="block mt-1 text-sm text-gray-900">{user.utis_code || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Role & Access</h3>
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="block text-sm font-medium text-gray-700">Role</span>
            <span className="block mt-1 text-sm text-gray-900">{getRoleDisplay()}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Status</span>
            <span className={`block mt-1 text-sm ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Account Information</h3>
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="block text-sm font-medium text-gray-700">Created</span>
            <span className="block mt-1 text-sm text-gray-900">{formatDate(user.created_at)}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Last Updated</span>
            <span className="block mt-1 text-sm text-gray-900">{formatDate(user.updated_at)}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Last Login</span>
            <span className="block mt-1 text-sm text-gray-900">{formatDate(user.last_login)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
