
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { RegionDetailView } from "@/components/regions/RegionDetailView";

const RegionDetails = () => {
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
  const regionData = {
    id: id || '1',
    name: 'Bakı şəhəri',
    description: 'Azərbaycanın paytaxtı və ən böyük şəhəri',
    createdAt: '2023-05-15',
    sectors: 5,
    schools: 134,
    users: 24,
    completionRate: 87
  };
  
  return (
    <Layout userRole="super-admin">
      <RegionDetailView region={regionData} />
    </Layout>
  );
};

export default RegionDetails;
