
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PencilIcon, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getSchoolWithAdmin } from '@/supabase/services/schools';
import { toast } from 'sonner';
import SchoolInfo from './details/SchoolInfo';
import AdminInfo from './details/AdminInfo';
import SchoolStats from './details/SchoolStats';
import { SchoolModal } from './modal/SchoolModal';

interface SchoolDetailViewProps {
  schoolId: string;
}

const SchoolDetailView: React.FC<SchoolDetailViewProps> = ({ schoolId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadSchoolData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getSchoolWithAdmin(schoolId);
        
        if (!data) {
          setError('Məktəb məlumatları tapılmadı');
          return;
        }
        
        setSchoolData(data);
      } catch (err) {
        console.error('Məktəb məlumatları yüklənərkən xəta:', err);
        setError('Məktəb məlumatları yüklənə bilmədi');
        toast.error('Məktəb məlumatları yüklənə bilmədi');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSchoolData();
  }, [schoolId]);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await getSchoolWithAdmin(schoolId);
      if (data) {
        setSchoolData(data);
        toast.success('Məlumatlar yeniləndi');
      }
    } catch (err) {
      toast.error('Məlumatları yeniləmə xətası');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
      </div>
    );
  }

  if (error || !schoolData) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg my-4">
        <h3 className="font-medium">Xəta</h3>
        <p>{error || 'Məktəb məlumatları tapılmadı'}</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri qayıt
        </Button>
      </div>
    );
  }

  const { school, admin } = schoolData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold text-infoline-dark-blue">{school.name}</h1>
        </div>
        <Button onClick={handleEditClick}>
          <PencilIcon className="h-4 w-4 mr-1" />
          Redaktə et
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SchoolInfo school={school} />
        </div>
        <div>
          <AdminInfo 
            admin={admin} 
            onAssignAdmin={() => {}} 
            onRemoveAdmin={() => {}} 
          />
        </div>
      </div>
      
      <SchoolStats school={school} />
      
      {isEditModalOpen && (
        <SchoolModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          initialData={school}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
};

export default SchoolDetailView;
