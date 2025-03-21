
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Users, BookOpen, Calendar, Award } from 'lucide-react';

export interface SchoolStatsProps {
  school: {
    student_count?: number;
    teacher_count?: number;
    completionRate?: number;
  };
}

export const SchoolStats: React.FC<SchoolStatsProps> = ({ school }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-600" />
            Şagird sayı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{school.student_count || 0}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-green-600" />
            Müəllim sayı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{school.teacher_count || 0}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-amber-600" />
            Dərslər
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">42</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Award className="h-4 w-4 mr-2 text-purple-600" />
            Tamamlanma faizi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <p className="text-2xl font-bold">{school.completionRate || 0}%</p>
            <div className="ml-auto h-3 w-16 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${school.completionRate || 0}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolStats;
