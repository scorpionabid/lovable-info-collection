
import React from 'react';
import { User } from '@/services/supabase/user/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminInfoProps {
  admin: User | null;
}

const AdminInfo: React.FC<AdminInfoProps> = ({ admin }) => {
  if (!admin) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Admin Məlumatları</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Bu məktəbə admin təyin edilməyib.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Admin Məlumatları</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Ad Soyad</h3>
            <p className="text-base">{admin.first_name} {admin.last_name}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">E-mail</h3>
            <p className="text-base">{admin.email}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Telefon</h3>
            <p className="text-base">{admin.phone || 'Təyin edilməyib'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Status</h3>
            <p className="text-base">{admin.is_active ? 'Aktiv' : 'Deaktiv'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Son giriş tarixi</h3>
            <p className="text-base">
              {admin.last_login ? new Date(admin.last_login).toLocaleDateString('az-AZ') : 'Heç vaxt'}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">UTIS Kodu</h3>
            <p className="text-base">{admin.utis_code || 'Təyin edilməyib'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminInfo;
