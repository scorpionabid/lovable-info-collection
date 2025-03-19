
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SchoolInfoProps {
  school: any;
}

export const SchoolInfo: React.FC<SchoolInfoProps> = ({ school }) => {
  if (!school) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Məktəb məlumatları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Məktəb adı</h3>
            <p className="mt-1">{school.name || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Kod</h3>
            <p className="mt-1">{school.code || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Region</h3>
            <p className="mt-1">{school.region?.name || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Sektor</h3>
            <p className="mt-1">{school.sector?.name || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Ünvan</h3>
            <p className="mt-1">{school.address || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Direktor</h3>
            <p className="mt-1">{school.director || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">E-poçt</h3>
            <p className="mt-1">{school.email || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Telefon</h3>
            <p className="mt-1">{school.phone || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1">{school.status || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Məktəb növü</h3>
            <p className="mt-1">{school.type?.name || '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
