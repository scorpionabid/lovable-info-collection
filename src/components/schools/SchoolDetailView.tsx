
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  getSchoolDetailsWithAdmin 
} from '@/services/supabase/school/queries/schoolQueries';
import { School } from '@/services/supabase/school/types';
import SchoolInfo from './details/SchoolInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminInfo from './details/AdminInfo';
import SchoolStats from './details/SchoolStats';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { SchoolModal } from './SchoolModal';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SchoolDetailView() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { schoolId } = useParams<{ schoolId: string }>();
  
  // Fetch school data with admin info
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['school', 'details', schoolId],
    queryFn: () => getSchoolDetailsWithAdmin(schoolId as string),
    enabled: !!schoolId
  });

  const handleUpdateSuccess = () => {
    refetch();
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return <SchoolDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <Card className="p-6">
        <CardContent className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-red-600">Xəta</h2>
          <p>Məktəb məlumatları yüklənərkən xəta baş verdi.</p>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="mt-4"
          >
            Yenidən cəhd et
          </Button>
        </CardContent>
      </Card>
    );
  }

  const school = data.school;
  const admin = data.admin;

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{school.name}</h1>
          <p className="text-muted-foreground">
            {school.sector?.name} / {school.region?.name}
          </p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit className="h-4 w-4" />
          Redaktə et
        </Button>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Ümumi məlumat</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="stats">Statistika</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <SchoolInfo school={school} />
        </TabsContent>

        <TabsContent value="admin">
          <AdminInfo admin={admin} />
        </TabsContent>

        <TabsContent value="stats">
          <SchoolStats schoolId={school.id} />
        </TabsContent>
      </Tabs>

      {isEditModalOpen && (
        <SchoolModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          schoolId={school.id}
          mode="edit"
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

function SchoolDetailSkeleton() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-40 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="mb-4">
        <Skeleton className="h-10 w-80" />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
