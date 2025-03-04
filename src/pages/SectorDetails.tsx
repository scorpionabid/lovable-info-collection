
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from "@/components/layout/Layout";
import { SectorDetailView } from "@/components/sectors/SectorDetailView";
import sectorService from '@/services/supabase/sectorService';
import { useToast } from '@/hooks/use-toast';

const SectorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(searchParams.get('edit') === 'true');

  // Fetch sector data with React Query
  const { 
    data: sector, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['sector', id],
    queryFn: () => sectorService.getSectorById(id as string),
    enabled: !!id,
    retry: 1,
  });

  // Fetch schools for this sector
  const { 
    data: schools = [], 
    isLoading: isLoadingSchools 
  } = useQuery({
    queryKey: ['sector-schools', id],
    queryFn: () => sectorService.getSectorSchools(id as string),
    enabled: !!id,
  });

  // Handle errors
  useEffect(() => {
    if (isError) {
      toast({
        title: "Xəta baş verdi",
        description: "Sektor məlumatları yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  // If we get a 404 error, redirect to sectors page
  useEffect(() => {
    if (error && (error as any).code === 'PGRST116') {
      toast({
        title: "Sektor tapılmadı",
        description: "İstədiyiniz sektor məlumatları tapılmadı",
        variant: "destructive",
      });
      navigate('/sectors');
    }
  }, [error, navigate, toast]);

  if (isLoading) {
    return (
      <Layout userRole="super-admin">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout userRole="super-admin">
      {sector && (
        <SectorDetailView 
          sector={sector} 
          schools={schools}
          isLoadingSchools={isLoadingSchools}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          onRefresh={refetch}
        />
      )}
    </Layout>
  );
};

export default SectorDetails;
