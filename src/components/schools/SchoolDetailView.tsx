
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSchoolWithAdmin } from '@/services/supabase/school/queries/schoolQueries';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SchoolInfo from './details/SchoolInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminInfo from './details/AdminInfo';
import SchoolStats from './details/SchoolStats';
import { Loader2, Edit, ArrowLeft } from 'lucide-react';
import SchoolModal from './modal/SchoolModal';

export const SchoolDetailView = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const schoolId = params.id;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['school', schoolId],
    queryFn: () => getSchoolWithAdmin(schoolId as string),
    enabled: !!schoolId,
  });

  const handleGoBack = () => {
    window.history.back();
  };

  const handleSchoolUpdated = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="h-10 w-10 animate-spin text-infoline-blue" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl text-red-600 mb-4">Məktəb məlumatları yüklənərkən xəta baş verdi</h2>
        <Button onClick={handleGoBack}>Geri Qayıt</Button>
      </Card>
    );
  }

  const { school, admin } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold">{school.name}</h1>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzəliş Et
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Ümumi Məlumat</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="stats">Statistika</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <SchoolInfo school={school} />
        </TabsContent>
        
        <TabsContent value="admin" className="mt-4">
          <AdminInfo admin={admin} />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-4">
          <SchoolStats schoolId={school.id} />
        </TabsContent>
      </Tabs>

      {isEditModalOpen && (
        <SchoolModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          schoolId={school.id}
          onSchoolUpdated={handleSchoolUpdated}
        />
      )}
    </div>
  );
};

export default SchoolDetailView;
