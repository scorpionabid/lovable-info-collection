
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { SchoolInfo } from "@/components/schools/SchoolInfo";
import { SchoolStats } from "@/components/schools/SchoolStats";
import { SchoolActionsBar } from "@/components/schools/SchoolActionsBar";
import { SchoolTabs } from "@/components/schools/SchoolTabs";
import { getSchoolById, getSchoolActivities } from "@/services/supabase/school";
import { useToast } from "@/hooks/use-toast";
import { SchoolModal } from "@/components/schools/modal/SchoolModal";

const SchoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [school, setSchool] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchSchool = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const schoolData = await getSchoolById(id);
        if (!schoolData) {
          toast({
            title: "Məktəb tapılmadı",
            description: "Məktəb tapılmadı və ya silinib",
            variant: "destructive",
          });
          navigate("/schools");
          return;
        }
        
        // Fetch recent activities
        const activities = await getSchoolActivities(id);
        
        setSchool({
          ...schoolData,
          activities: activities || []
        });
      } catch (error) {
        console.error("Error fetching school:", error);
        toast({
          title: "Məktəb yüklənmə xətası",
          description: "Məktəb məlumatlarını yükləyərkən xəta baş verdi",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchool();
  }, [id, navigate]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    toast({
      title: "Məktəb yeniləndi",
      description: "Məktəb məlumatları uğurla yeniləndi",
    });
    // Refresh school data
    if (id) {
      getSchoolById(id).then(schoolData => {
        if (schoolData) {
          setSchool(prev => ({
            ...schoolData,
            activities: prev.activities || []
          }));
        }
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Yüklənir...</div>;
  }

  if (!school) {
    return <div className="container mx-auto py-8">Məktəb tapılmadı</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/schools")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Məktəblərə qayıt
        </Button>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{school.name}</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Redaktə et
            </Button>
            <Button variant="destructive" onClick={() => {}}>
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SchoolInfo school={school} />
        </div>
        <div>
          <SchoolStats school={school} />
        </div>
      </div>

      <SchoolActionsBar school={school} />
      <SchoolTabs school={school} />

      {isEditModalOpen && (
        <SchoolModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          initialData={school}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default SchoolDetails;
