
import React from 'react';
import { School } from '@/services/supabase/school/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SchoolInfoProps {
  school: School;
}

const SchoolInfo: React.FC<SchoolInfoProps> = ({ school }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Məktəb Məlumatları</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Məktəb adı</h3>
            <p className="text-base">{school.name}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Kod</h3>
            <p className="text-base">{school.code || 'Təyin edilməyib'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Ünvan</h3>
            <p className="text-base">{school.address || 'Təyin edilməyib'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Direktor</h3>
            <p className="text-base">{school.director || 'Təyin edilməyib'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Telefon</h3>
            <p className="text-base">{school.phone || 'Təyin edilməyib'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">E-mail</h3>
            <p className="text-base">{school.email || 'Təyin edilməyib'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Status</h3>
            <p className="text-base">{school.status || 'Aktiv'}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-500">Yaradılma tarixi</h3>
            <p className="text-base">
              {school.created_at ? new Date(school.created_at).toLocaleDateString('az-AZ') : '-'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolInfo;
