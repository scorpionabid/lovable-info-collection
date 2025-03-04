
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from "@/components/layout/Layout";
import { RegionDetailView } from "@/components/regions/RegionDetailView";
import regionService from '@/services/supabase/regionService';

const RegionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Query to fetch region details
  const { data: region, isLoading, isError, error } = useQuery({
    queryKey: ['region', id],
    queryFn: () => regionService.getRegionById(id!),
    enabled: !!id, // Only run query if id exists
  });
  
  // Query to fetch region sectors
  const { data: sectors } = useQuery({
    queryKey: ['regionSectors', id],
    queryFn: () => regionService.getRegionSectors(id!),
    enabled: !!id, // Only run query if id exists
  });

  // Handle error - navigate back to regions list
  if (isError) {
    console.error('Error fetching region details:', error);
    setTimeout(() => navigate('/regions'), 3000);
    
    return (
      <Layout userRole="super-admin">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-red-500 text-xl mb-4">Xəta baş verdi</div>
          <p className="text-infoline-dark-gray mb-4">Region məlumatları yüklənərkən xəta baş verdi.</p>
          <p className="text-infoline-dark-gray">Regionlar siyahısına yönləndirilirsiniz...</p>
        </div>
      </Layout>
    );
  }
  
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
      <RegionDetailView 
        region={region!} 
        sectors={sectors || []}
        onRegionUpdated={() => queryClient.invalidateQueries({ queryKey: ['region', id] })}
      />
    </Layout>
  );
};

export default RegionDetails;
