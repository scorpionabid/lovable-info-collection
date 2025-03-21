
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { School } from "@/supabase/types";
import { useSchoolType } from "../hooks/useSchoolType";

interface SchoolInfoProps {
  school: School;
  regionName?: string;
  sectorName?: string;
}

export const SchoolInfo: React.FC<SchoolInfoProps> = ({ school, regionName, sectorName }) => {
  const { schoolType } = useSchoolType(school.type_id);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-infoline-dark-blue">Məktəb Məlumatları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Məktəb Kodu:</p>
            <p className="font-medium">{school.code || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Region:</p>
            <p className="font-medium">{regionName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Sektor:</p>
            <p className="font-medium">{sectorName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Məktəb Növü:</p>
            <p className="font-medium">{schoolType?.name || 'N/A'}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-gray-500 mb-1">Ünvan:</p>
          <p className="font-medium">{school.address || 'N/A'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Telefon:</p>
            <p className="font-medium">{school.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">E-poçt:</p>
            <p className="font-medium">{school.email || 'N/A'}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-gray-500 mb-1">Direktor:</p>
          <p className="font-medium">{school.director || 'N/A'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Şagird Sayı:</p>
            <p className="font-medium">{school.student_count || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Müəllim Sayı:</p>
            <p className="font-medium">{school.teacher_count || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
