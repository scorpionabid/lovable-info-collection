
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface SchoolStatsProps {
  completionRate: number;
  studentCount?: number;
  teacherCount?: number;
}

export const SchoolStats = ({ completionRate, studentCount = 0, teacherCount = 0 }: SchoolStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tamamlanma Göstəricisi</CardTitle>
          <CardDescription>Məlumatların doldurulma faizi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-2">
            <div className="w-24 h-24">
              <CircularProgressbar
                value={completionRate}
                text={`${completionRate}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: `rgba(62, 152, 199, ${completionRate / 100})`,
                  textColor: '#555',
                  trailColor: '#d6d6d6',
                  backgroundColor: '#3e98c7',
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Şagirdlər</CardTitle>
          <CardDescription>Ümumi şagird sayı</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-center py-4">{studentCount}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Müəllimlər</CardTitle>
          <CardDescription>Ümumi müəllim sayı</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-center py-4">{teacherCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};
