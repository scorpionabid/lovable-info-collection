
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserX, UserPlus, Mail, Phone } from 'lucide-react';

interface AdminInfoProps {
  admin: any;
  onAssignAdmin?: () => void;
  onRemoveAdmin?: () => void;
}

const AdminInfo: React.FC<AdminInfoProps> = ({ admin, onAssignAdmin, onRemoveAdmin }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-infoline-dark-blue flex justify-between items-center">
          <span>Məsul şəxs</span>
          {admin ? (
            <Button
              variant="destructive"
              size="sm"
              className="h-8"
              onClick={onRemoveAdmin}
            >
              <UserX className="h-4 w-4 mr-1" />
              Təyin etməni ləğv et
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="h-8"
              onClick={onAssignAdmin}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Admin təyin et
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {admin ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-infoline-blue text-white flex items-center justify-center font-medium">
                {admin.first_name?.charAt(0)}{admin.last_name?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{admin.first_name} {admin.last_name}</p>
                <p className="text-sm text-gray-500">{admin.roles?.name || 'School Admin'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{admin.email || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{admin.phone || 'N/A'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Bu məktəbə hələ admin təyin edilməyib</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminInfo;
