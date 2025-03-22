
import React from 'react';
import { User } from '@/lib/supabase/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  getUserStatusBadgeColor, 
  getUserStatusText, 
  getUserDisplayEntity 
} from '../../utils/userUtils';
import { UserInfo } from './UserInfo';
import { UserContactInfo } from './UserContactInfo';
import { UserRole } from './UserRole';
import { UserActions } from './UserActions';
import { formatDate } from '@/lib/utils';
import { getRolePermissions } from '@/lib/supabase/types/user/role';

interface UserViewModalProps {
  user: User;
  onClose: () => void;
}

export const UserViewModal: React.FC<UserViewModalProps> = ({ user, onClose }) => {
  const actionsWithClose = {
    user,
    onClose
  };

  return (
    <div className="space-y-6">
      <UserInfo user={user} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <UserContactInfo user={user} />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-semibold mb-4">Role & Permissions</h3>
            <UserRole user={user} />
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Entity</h4>
              <p>{getUserDisplayEntity(user)}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-1">
                {getRolePermissions(user.roles).length > 0 ? (
                  getRolePermissions(user.roles).map((permission, index) => (
                    <Badge key={index} variant="outline" className="mb-1">
                      {permission}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">No permissions set</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <h3 className="text-lg font-semibold mb-4">User Status</h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium mb-2">Current Status</h4>
              <Badge 
                variant="outline" 
                className={getUserStatusBadgeColor(user.is_active)}
              >
                {getUserStatusText(user.is_active)}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Last Login</h4>
              <p>{user.last_login ? formatDate(user.last_login) : 'Never'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Joined</h4>
              <p>{user.created_at ? formatDate(user.created_at) : 'Unknown'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <UserActions user={user} onClose={onClose} />
    </div>
  );
};

export default UserViewModal;
