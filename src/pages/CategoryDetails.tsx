
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { CategoryDetailView } from "@/components/categories/CategoryDetailView";

const CategoryDetails = () => {
  const { id } = useParams();
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
  
  // Mock data for the category
  const categoryData = {
    id: id || '1',
    name: 'Müəllim Məlumatları',
    description: 'Məktəb müəllimlərinin əsas məlumatları',
    assignment: 'All',
    priority: 1,
    deadline: '2023-12-15',
    completionRate: 78,
    status: 'Active',
    createdAt: '2023-05-10',
    columns: [
      {
        id: '1',
        name: 'Ad',
        type: 'text',
        required: true,
        description: 'Müəllimin adı',
        order: 1
      },
      {
        id: '2',
        name: 'Soyad',
        type: 'text',
        required: true,
        description: 'Müəllimin soyadı',
        order: 2
      },
      {
        id: '3',
        name: 'Doğum tarixi',
        type: 'date',
        required: true,
        description: 'Müəllimin doğum tarixi',
        order: 3
      },
      {
        id: '4',
        name: 'Cinsi',
        type: 'select',
        required: true,
        description: 'Müəllimin cinsi',
        options: ['Kişi', 'Qadın'],
        order: 4
      },
      {
        id: '5',
        name: 'Təhsil səviyyəsi',
        type: 'select',
        required: true,
        description: 'Müəllimin təhsil səviyyəsi',
        options: ['Bakalavr', 'Magistr', 'Doktorantura'],
        order: 5
      },
      {
        id: '6',
        name: 'İxtisas',
        type: 'text',
        required: true,
        description: 'Müəllimin ixtisası',
        order: 6
      },
      {
        id: '7',
        name: 'İş təcrübəsi (il)',
        type: 'number',
        required: true,
        description: 'Müəllimin iş təcrübəsi illə',
        order: 7
      },
      {
        id: '8',
        name: 'Əlaqə nömrəsi',
        type: 'text',
        required: true,
        description: 'Müəllimin əlaqə nömrəsi',
        order: 8
      },
      {
        id: '9',
        name: 'Email',
        type: 'text',
        required: false,
        description: 'Müəllimin email ünvanı',
        order: 9
      },
      {
        id: '10',
        name: 'Sertifikatlar',
        type: 'text',
        required: false,
        description: 'Müəllimin malik olduğu sertifikatlar',
        order: 10
      },
      {
        id: '11',
        name: 'Tədris etdiyi fənn',
        type: 'text',
        required: true,
        description: 'Müəllimin tədris etdiyi fənn',
        order: 11
      },
      {
        id: '12',
        name: 'Əlavə qeydlər',
        type: 'textarea',
        required: false,
        description: 'Əlavə qeydlər',
        order: 12
      }
    ]
  };
  
  return (
    <Layout userRole="super-admin">
      <CategoryDetailView category={categoryData} />
    </Layout>
  );
};

export default CategoryDetails;
