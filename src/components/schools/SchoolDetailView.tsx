import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, ArrowLeft } from "lucide-react";
import { SchoolStats } from './details/SchoolStats';
import { AdminInfo } from './details/AdminInfo';
import { SchoolModal } from './modal/SchoolModal';
import { getSchoolWithAdmin } from '@/services/supabase/school/queries/schoolQueries';

export const SchoolDetailView = ({ schoolId }: { schoolId: string }) => {
  const [schoolData, setSchoolData] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        const schoolWithAdmin = await getSchoolWithAdmin(schoolId);
        
        if (schoolWithAdmin) {
          setSchoolData(schoolWithAdmin.school);
          setAdmin(schoolWithAdmin.admin);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching school details:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolDetails();
  }, [schoolId]);

  if (isLoading) {
    return <div>Yüklənir...</div>;
  }

  if (isError || !schoolData) {
    return <div>Məktəb tapılmadı və ya xəta baş verdi.</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4">
        <Link to="/schools" className="flex items-center gap-2 text-blue-500 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          Məktəblərə qayıt
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{schoolData.name}</h1>
          <p className="text-gray-500">Məktəb haqqında məlumat</p>
        </div>
        <Button asChild>
          <Link to={`/schools/edit/${schoolId}`} className="flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Redaktə et
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <SchoolStats school={schoolData} />
        </div>
        <div className="md:col-span-1">
          <AdminInfo 
            admin={admin} 
            onAssignAdmin={() => setIsAdminModalOpen(true)} 
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ətraflı məlumat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Ad:</strong> {schoolData.name}</p>
            <p><strong>Ünvan:</strong> {schoolData.address}</p>
            <p><strong>Sektor:</strong> {schoolData.sector}</p>
            {/* Daha çox məlumat əlavə edilə bilər */}
          </div>
        </CardContent>
      </Card>
      
      {isAdminModalOpen && (
        <SchoolModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          mode="edit"
          initialData={schoolData}
          onSuccess={() => {
            // Refetch school details after admin assignment
            getSchoolWithAdmin(schoolId).then(updatedSchoolWithAdmin => {
              if (updatedSchoolWithAdmin) {
                setSchoolData(updatedSchoolWithAdmin.school);
                setAdmin(updatedSchoolWithAdmin.admin);
              }
            });
            setIsAdminModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SchoolDetailView;
