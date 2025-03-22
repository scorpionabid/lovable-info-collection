
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSchoolType } from '../hooks/useSchoolType';
import { School } from '@/lib/supabase/types/school';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { MapPin, Mail, Phone, UserCheck, Award, Hash, School as SchoolIcon } from 'lucide-react';

interface SchoolInfoProps {
  school: School;
}

export const SchoolInfo: React.FC<SchoolInfoProps> = ({ school }) => {
  const { data: schoolType, isLoading } = useSchoolType(school.type_id);
  
  if (isLoading) {
    return <SkeletonCard className="w-full h-full" />;
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2">
          <SchoolIcon className="h-5 w-5" />
          <span>Məktəb məlumatları</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Hash className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Məktəb kodu</p>
                <p className="text-sm text-muted-foreground">
                  {school.code || "Məlumat yoxdur"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Award className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Məktəb növü</p>
                <p className="text-sm text-muted-foreground">
                  {schoolType?.name || "Məlumat yoxdur"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <UserCheck className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Direktor</p>
                <p className="text-sm text-muted-foreground">
                  {school.director || "Məlumat yoxdur"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Ünvan</p>
                <p className="text-sm text-muted-foreground">
                  {school.address || "Məlumat yoxdur"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">E-poçt</p>
                <p className="text-sm text-muted-foreground">
                  {school.email || "Məlumat yoxdur"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Telefon</p>
                <p className="text-sm text-muted-foreground">
                  {school.phone || "Məlumat yoxdur"}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center py-2 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700 font-medium">Şagird sayı</p>
            <p className="text-lg font-bold text-blue-800">
              {school.student_count || 0}
            </p>
          </div>
          <div className="text-center py-2 bg-green-50 rounded-md">
            <p className="text-sm text-green-700 font-medium">Müəllim sayı</p>
            <p className="text-lg font-bold text-green-800">
              {school.teacher_count || 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolInfo;
