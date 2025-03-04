
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/Layout";
import { SchoolDetailView } from "@/components/schools/SchoolDetailView";
import { Toaster } from "@/components/ui/toaster";
import { getSchoolById, getSchoolStats, getSchoolActivities } from "@/services/supabase/schoolService";

const SchoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [school, setSchool] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  
  useEffect(() => {
    if (!id) {
      navigate('/schools');
      return;
    }
    
    const loadSchoolData = async () => {
      try {
        setIsLoading(true);
        
        // Load school details
        const schoolData = await getSchoolById(id);
        setSchool(schoolData);
        
        // Load school statistics
        const statsData = await getSchoolStats(id);
        setStats(statsData);
        
        // Load recent activities
        const activitiesData = await getSchoolActivities(id);
        setActivities(activitiesData);
        
      } catch (error) {
        console.error('Error loading school details:', error);
        toast({
          title: "Xəta baş verdi",
          description: "Məktəb məlumatları yüklənmədi",
          variant: "destructive"
        });
        navigate('/schools');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSchoolData();
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <Layout userRole="super-admin">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
        </div>
        <Toaster />
      </Layout>
    );
  }
  
  return (
    <Layout userRole="super-admin">
      {school && (
        <SchoolDetailView 
          school={school} 
          stats={stats}
          activities={activities}
        />
      )}
      <Toaster />
    </Layout>
  );
};

export default SchoolDetails;
