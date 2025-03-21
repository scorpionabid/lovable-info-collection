
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { School } from '@/supabase/types';

interface SchoolStatsProps {
  school: School;
}

const SchoolStats: React.FC<SchoolStatsProps> = ({ school }) => {
  const completionRate = school.completionRate || 0;
  const studentCount = school.student_count || 0;
  const teacherCount = school.teacher_count || 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-infoline-dark-blue">
          Məktəb statistikası
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 text-center">Tamamlanma dərəcəsi</p>
            <div className="w-24 h-24 mx-auto">
              <CircularProgressbar
                value={completionRate}
                text={`${completionRate}%`}
                styles={buildStyles({
                  textSize: '22px',
                  pathColor: getCompletionColor(completionRate),
                  textColor: getCompletionColor(completionRate),
                  trailColor: '#e0e0e0',
                })}
              />
            </div>
          </div>
          
          <StatCard
            title="Şagird sayı"
            value={studentCount}
            icon="👨‍🎓"
            color="bg-blue-50 text-blue-800"
          />
          
          <StatCard
            title="Müəllim sayı"
            value={teacherCount}
            icon="👨‍🏫"
            color="bg-green-50 text-green-800"
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg border border-gray-200">
      <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center text-xl`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

// Tamamlanma dərəcəsinə görə rəng vermə
const getCompletionColor = (rate: number): string => {
  if (rate >= 80) return '#10b981'; // green
  if (rate >= 60) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

export default SchoolStats;
