
import React from 'react';
import { User } from '@/lib/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface UserAssignmentsProps {
  user: User;
}

export const UserAssignments: React.FC<UserAssignmentsProps> = ({ user }) => {
  // In a real application, you would fetch this data from the API
  // For now, we'll use empty dummy data
  const assignments = [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Tapşırıqlar</CardTitle>
      </CardHeader>
      
      <CardContent>
        {assignments.length > 0 ? (
          <div className="space-y-3">
            {assignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  {/* Replace with real status check */}
                  {Math.random() > 0.5 ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span>Assignment name</span>
                </div>
                <span className="text-sm text-gray-500">Due date</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Heç bir tapşırıq tapılmadı
          </div>
        )}
      </CardContent>
    </Card>
  );
};
