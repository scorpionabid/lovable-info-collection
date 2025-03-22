
import React from 'react';
import { School } from '@/lib/supabase/types/school';
import { Card, CardContent } from '@/components/ui/card';
import { useSchoolType } from '../hooks/useSchoolType';

interface SchoolViewProps {
  school: School;
}

export const SchoolView: React.FC<SchoolViewProps> = ({ school }) => {
  const { data: schoolType } = useSchoolType(school.type_id);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Əsas Məlumatlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Məktəb adı</p>
              <p className="font-medium">{school.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Məktəb kodu</p>
              <p className="font-medium">{school.code || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Məktəb tipi</p>
              <p className="font-medium">{schoolType?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{school.status || 'Aktiv'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Əlaqə Məlumatları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Ünvan</p>
              <p className="font-medium">{school.address || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{school.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefon</p>
              <p className="font-medium">{school.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Direktor</p>
              <p className="font-medium">{school.director || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Statistika</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Şagird sayı</p>
              <p className="font-medium">{school.student_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Müəllim sayı</p>
              <p className="font-medium">{school.teacher_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tamamlanma faizi</p>
              <p className="font-medium">{school.completionRate || 0}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolView;
