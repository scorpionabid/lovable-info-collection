
import React from 'react';
import { User } from '@/lib/supabase/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Lock, ArchiveX, CheckCircle, XCircle } from 'lucide-react';

export interface UserActionsProps {
  user: User;
  onClose: () => void;
}

export const UserActions: React.FC<UserActionsProps> = ({ user, onClose }) => {
  // Handle various user actions
  const handleResetPassword = () => {
    console.log('Reset password for user:', user.id);
    // Implement reset password logic here
  };

  const handleSendEmail = () => {
    console.log('Send email to user:', user.email);
    // Implement send email logic here
  };

  const handleToggleStatus = () => {
    console.log('Toggle user status:', user.id, !user.is_active);
    // Implement toggle status logic here
  };

  const handleDeleteUser = () => {
    console.log('Delete user:', user.id);
    // Implement delete user logic here
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="text-lg font-semibold mb-4">User Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={handleResetPassword}
          >
            <Lock className="mr-2 h-4 w-4" />
            Reset Password
          </Button>
          
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={handleSendEmail}
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
          
          <Button 
            variant={user.is_active ? "destructive" : "outline"} 
            className="justify-start"
            onClick={handleToggleStatus}
          >
            {user.is_active ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </Button>
          
          <Button 
            variant="destructive" 
            className="justify-start"
            onClick={handleDeleteUser}
          >
            <ArchiveX className="mr-2 h-4 w-4" />
            Delete User
          </Button>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActions;
