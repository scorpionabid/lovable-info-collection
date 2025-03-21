
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog, Mail, Phone, PlusCircle } from 'lucide-react';

interface AdminInfoProps {
  admin: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  } | null;
  onAssignAdmin: () => void;
}

export const AdminInfo: React.FC<AdminInfoProps> = ({ admin, onAssignAdmin }) => {
  if (!admin) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <UserCog className="h-5 w-5 mr-2" />
            Məktəb Administratoru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <UserCog className="h-12 w-12 text-infoline-light-gray mb-3" />
            <p className="text-infoline-dark-gray mb-3">Bu məktəb üçün admin təyin edilməyib</p>
            <Button 
              onClick={onAssignAdmin}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Admin Təyin Et
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <UserCog className="h-5 w-5 mr-2" />
          Məktəb Administratoru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-infoline-light-blue flex items-center justify-center text-white font-medium">
              {admin.first_name?.[0]}{admin.last_name?.[0]}
            </div>
            <div className="ml-3">
              <h3 className="font-medium">{admin.first_name} {admin.last_name}</h3>
              <p className="text-sm text-infoline-dark-gray">Admin</p>
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            {admin.email && (
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-infoline-dark-gray" />
                <span>{admin.email}</span>
              </div>
            )}
            
            {admin.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-infoline-dark-gray" />
                <span>{admin.phone}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAssignAdmin}
            >
              Dəyişdir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminInfo;
