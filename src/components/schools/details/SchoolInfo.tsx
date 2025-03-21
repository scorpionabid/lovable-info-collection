
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School } from '@/supabase/types';

interface SchoolInfoProps {
  school: School;
}

const SchoolInfo: React.FC<SchoolInfoProps> = ({ school }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-infoline-dark-blue">
          Məktəb məlumatları
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Məktəb adı" value={school.name} />
          <InfoItem label="Kod" value={school.code || 'N/A'} />
          <InfoItem label="Region" value={school.region || 'N/A'} />
          <InfoItem label="Sektor" value={school.sector || 'N/A'} />
          <InfoItem label="Ünvan" value={school.address || 'N/A'} />
          <InfoItem label="Status" value={school.status || 'Aktiv'} />
          <InfoItem label="Direktor" value={school.director || 'N/A'} />
          <InfoItem label="Email" value={school.email || 'N/A'} />
          <InfoItem label="Telefon" value={school.phone || 'N/A'} />
          <InfoItem label="Yaradılma tarixi" value={formatDate(school.created_at)} />
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('az-AZ');
};

export default SchoolInfo;
