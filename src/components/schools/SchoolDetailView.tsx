
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { SchoolModal } from './SchoolModal';
import { deleteSchool } from '@/services/supabase/schoolService';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/services/api/userService';
import {
  SchoolHeader,
  GeneralInfoCard,
  StatisticsCard,
  ActivitiesCard
} from './detail';

export const SchoolDetailView = ({ school, stats, activities }: any) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [schoolAdmin, setSchoolAdmin] = useState<User | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  
  // Fetch school admin when school data changes
  useEffect(() => {
    const fetchSchoolAdmin = async () => {
      if (!school?.id) return;
      
      setIsLoadingAdmin(true);
      try {
        // Get role ID for school-admin
        const { data: roleData } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'school-admin')
          .single();
          
        if (!roleData) {
          console.error('School admin role not found');
          return;
        }
        
        // Get admin for this school
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('school_id', school.id)
          .eq('role_id', roleData.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching school admin:', error);
          return;
        }
        
        setSchoolAdmin(data as User | null);
      } catch (error) {
        console.error('Error loading school admin:', error);
      } finally {
        setIsLoadingAdmin(false);
      }
    };
    
    fetchSchoolAdmin();
  }, [school?.id]);
  
  const handleSchoolUpdated = () => {
    toast({
      title: "Məktəb yeniləndi",
      description: "Məktəb məlumatları uğurla yeniləndi."
    });
    setIsEditModalOpen(false);
  };
  
  const handleExport = async () => {
    toast({
      title: "Eksport edilir",
      description: "Məktəb məlumatları eksport edilir..."
    });
  };
  
  const handleDelete = async () => {
    try {
      await deleteSchool(school.id);
      toast({
        title: "Məktəb silindi",
        description: "Məktəb uğurla silindi."
      });
      navigate('/schools');
    } catch (error) {
      console.error('Error deleting school:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Məktəb silinmədi",
        variant: "destructive"
      });
    }
  };
  
  const handleAssignAdmin = async (userId: string) => {
    if (!userId || !school?.id) {
      toast({
        title: "Xəta",
        description: "İstifadəçi və ya məktəb ID-si yoxdur",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsAssigning(true);
      
      const { error } = await supabase
        .from('users')
        .update({ school_id: school.id })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Refresh school admin data
      const { data: updatedAdmin } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      setSchoolAdmin(updatedAdmin as User);
      
      toast({
        title: "Admin təyin edildi",
        description: "Məktəb admini uğurla təyin edildi."
      });
    } catch (error) {
      console.error('Error assigning school admin:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Admin təyin edilmədi",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  if (!school) {
    return <div>Məlumat yüklənir...</div>;
  }

  const categoryData = stats?.categories.map((cat: any) => ({
    name: cat.name,
    value: cat.value
  })) || [];
  
  const completionData = stats?.completionHistory.map((hist: any) => ({
    name: hist.name,
    value: hist.value
  })) || [];

  const chartColors = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'];

  return (
    <div className="space-y-6">
      <SchoolHeader 
        school={school}
        onEdit={() => setIsEditModalOpen(true)}
        onExport={handleExport}
        onDelete={handleDelete}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GeneralInfoCard 
          school={school}
          isAssigning={isAssigning}
          onAssignAdmin={handleAssignAdmin}
          admin={schoolAdmin}
          isLoadingAdmin={isLoadingAdmin}
        />
        
        <StatisticsCard 
          categoryData={categoryData}
          completionData={completionData}
          chartColors={chartColors}
        />
      </div>
      
      <ActivitiesCard activities={activities} />
      
      {isEditModalOpen && (
        <SchoolModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          school={school}
          onSchoolUpdated={handleSchoolUpdated}
        />
      )}
    </div>
  );
};
