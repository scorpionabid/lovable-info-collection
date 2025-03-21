
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { getSchoolById } from '@/services/supabase/school/queries/schoolQueries';
import { SchoolModal } from './SchoolModal';
import { School } from '@/services/supabase/school/types';

export const SchoolDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const {
    data: school,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['school', id],
    queryFn: () => getSchoolById(id!),
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-40 bg-slate-200 rounded"></div>
            <div className="h-40 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError || !school) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-800">
          <h3 className="text-lg font-medium">Xəta baş verdi</h3>
          <p>Məktəb məlumatlarını yükləmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => refetch()}
          >
            Yenidən cəhd et
          </Button>
        </div>
      </div>
    );
  }
  
  const handleSchoolUpdated = () => {
    refetch();
    setIsEditModalOpen(false);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-infoline-dark-blue">{school.name}</h1>
        <Button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-infoline-blue hover:bg-infoline-dark-blue"
        >
          Redaktə et
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-infoline-dark-blue">Ümumi məlumatlar</h2>
          <dl className="grid grid-cols-1 gap-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Şəhər/Rayon:</dt>
              <dd className="text-sm text-gray-900 col-span-2">{school.region || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Sektor:</dt>
              <dd className="text-sm text-gray-900 col-span-2">{school.sector || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Məktəb növü:</dt>
              <dd className="text-sm text-gray-900 col-span-2">{school.type || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Direktor:</dt>
              <dd className="text-sm text-gray-900 col-span-2">{school.director || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Status:</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  school.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {school.status || 'N/A'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
        
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-infoline-dark-blue">Əlaqə məlumatları</h2>
          <dl className="grid grid-cols-1 gap-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Ünvan:</dt>
              <dd className="text-sm text-gray-900 col-span-2">{school.address || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Email:</dt>
              <dd className="text-sm text-gray-900 col-span-2">{school.email || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Telefon:</dt>
              <dd className="text-sm text-gray-900 col-span-2">{school.phone || 'N/A'}</dd>
            </div>
          </dl>
        </div>
        
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-infoline-dark-blue">Statistika</h2>
          <dl className="grid grid-cols-1 gap-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Müəllim sayı:</dt>
              <dd className="text-sm text-gray-900 col-span-2">{school.teacher_count || 0}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Şagird sayı:</dt>
              <dd className="text-sm text-gray-900 col-span-2">{school.student_count || 0}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">Doluluk dərəcəsi:</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-infoline-blue h-2.5 rounded-full" 
                      style={{ width: `${school.completionRate || 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{school.completionRate || 0}%</span>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {isEditModalOpen && (
        <SchoolModal
          isOpen={true}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          school={school as School}
          onSchoolUpdated={handleSchoolUpdated}
        />
      )}
    </div>
  );
};
