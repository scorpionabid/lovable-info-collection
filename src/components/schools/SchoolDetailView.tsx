
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { getSchoolWithAdmin } from '@/services/supabase/school/queries/schoolQueries';
import { School } from '@/services/supabase/school/types';
import { SchoolModal } from './SchoolModal';
import { toast } from 'sonner';

// Define proper type for params
interface RouteParams {
  schoolId: string;
  [key: string]: string | undefined;
}

const SchoolDetailView: React.FC = () => {
  const { schoolId } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [school, setSchool] = useState<School | null>(null);
  const [admin, setAdmin] = useState<any | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['school', schoolId],
    queryFn: () => getSchoolWithAdmin(schoolId as string),
    enabled: !!schoolId,
    onSuccess: (result) => {
      if (result) {
        setSchool(result.school);
        setAdmin(result.admin);
      }
    },
    onError: (error) => {
      toast.error(`Məktəb məlumatları alınarkən xəta baş verdi: ${error}`);
    }
  });

  useEffect(() => {
    if (data) {
      setSchool(data.school);
      setAdmin(data.admin);
    }
  }, [data]);

  const handleSchoolUpdated = () => {
    refetch();
  };

  if (isLoading || !schoolId) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-infoline-blue" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg">Məktəb tapılmadı.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <Button onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Geri
      </Button>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{school.name}</CardTitle>
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Redaktə et
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center">
              <span className="font-semibold w-32">Kod:</span>
              <span>{school.code}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Tip:</span>
              <span>{school.type}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Region:</span>
              <span>{school.region}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Sektor:</span>
              <span>{school.sector}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Ünvan:</span>
              <span>{school.address}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Direktor:</span>
              <span>{school.director}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Email:</span>
              <span>{school.email}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Telefon:</span>
              <span>{school.phone}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Şagird sayı:</span>
              <span>{school.studentCount}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Müəllim sayı:</span>
              <span>{school.teacherCount}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Yaradılma tarixi:</span>
              <span>{new Date(school.createdAt).toLocaleDateString()}</span>
            </div>
            {admin && (
              <>
                <div className="flex items-center">
                  <span className="font-semibold w-32">Admin Adı:</span>
                  <span>{admin.first_name} {admin.last_name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-32">Admin Email:</span>
                  <span>{admin.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-32">Admin Telefon:</span>
                  <span>{admin.phone}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <SchoolModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          mode="edit"
          schoolId={school.id}
          onSchoolUpdated={handleSchoolUpdated}
        />
      )}
    </div>
  );
};

export default SchoolDetailView;
