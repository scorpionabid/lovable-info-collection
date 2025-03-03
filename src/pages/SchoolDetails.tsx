
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { SchoolDetailView } from "@/components/schools/SchoolDetailView";

const SchoolDetails = () => {
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
  const schoolData = {
    id: id || '1',
    name: 'Bakı şəhəri 20 nömrəli məktəb',
    type: 'Orta məktəb',
    region: 'Bakı şəhəri',
    sector: 'Nəsimi rayonu',
    studentCount: 1250,
    teacherCount: 87,
    completionRate: 92,
    status: 'Aktiv',
    director: 'Əliyev Vüqar',
    contactEmail: 'mekteb20@edu.az',
    contactPhone: '+994 12 555 20 20',
    createdAt: '2023-05-10',
    address: 'Nəsimi rayonu, Nizami küçəsi 20'
  };
  
  return (
    <Layout userRole="super-admin">
      <SchoolDetailView school={schoolData} />
    </Layout>
  );
};

export default SchoolDetails;
