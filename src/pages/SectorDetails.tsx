
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { SectorDetailView } from "@/components/sectors/SectorDetailView";

const SectorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // This would typically fetch data from an API
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  if (isLoading) {
    return (
      <Layout userRole="super-admin">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
        </div>
      </Layout>
    );
  }
  
  // This is placeholder mock data
  const sectorData = {
    id: id || '1',
    name: 'Yasamal rayonu',
    description: 'Bakı şəhərinin mərkəzi rayonlarından biri',
    regionId: '1',
    regionName: 'Bakı şəhəri',
    createdAt: '2023-06-10',
    schools: 24,
    users: 12,
    completionRate: 92
  };
  
  return (
    <Layout userRole="super-admin">
      <SectorDetailView sector={sectorData} />
    </Layout>
  );
};

export default SectorDetails;
