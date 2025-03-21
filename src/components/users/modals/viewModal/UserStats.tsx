
import React from 'react';
import { User } from '@/lib/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  BookOpen, 
  ClipboardCheck, 
  Clock, 
  FileText 
} from 'lucide-react';

interface UserStatsProps {
  user: User;
}

export const UserStats: React.FC<UserStatsProps> = ({ user }) => {
  // In a real application, you would fetch these stats from the API
  // For now, we'll use dummy data
  const stats = {
    dataEntries: 0,
    approvedEntries: 0,
    pendingEntries: 0,
    lastActivity: '-'
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">İstifadəçi aktivliyi</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Daxil edilmiş məlumatlar:</span>
            <span className="font-semibold">{stats.dataEntries}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Təsdiqlənən:</span>
            <span className="font-semibold">{stats.approvedEntries}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Gözləyən:</span>
            <span className="font-semibold">{stats.pendingEntries}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <BarChart className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Tamamlanma dərəcəsi:</span>
            <span className="font-semibold">0%</span>
          </div>
          
          <div className="col-span-2 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Son aktivlik:</span>
            <span className="font-semibold">{stats.lastActivity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
