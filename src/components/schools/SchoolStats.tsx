
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SchoolStatsProps {
  school: any;
}

export const SchoolStats: React.FC<SchoolStatsProps> = ({ school }) => {
  if (!school) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistika</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <StatItem label="Şagird sayı" value={school.student_count || 0} />
          <StatItem label="Müəllim sayı" value={school.teacher_count || 0} />
          <StatItem 
            label="Tamamlanma faizi" 
            value={`${Math.round(school.completionRate || 0)}%`} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: string | number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);
