
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Layout } from "@/components/layout/Layout";
import { CategoryDetailView } from "@/components/categories/CategoryDetailView";
import { getCategoryById } from '@/services/supabase/category/categoryQueries';
import { getCategoryColumns } from '@/services/supabase/category/columnQueries';

const CategoryDetails = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch category data
  const { 
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError 
  } = useQuery({
    queryKey: ['category', id],
    queryFn: () => id ? getCategoryById(id) : null,
    enabled: !!id,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Error loading category:', error);
          toast.error('Kateqoriya məlumatlarını yükləyərkən xəta baş verdi');
        }
      }
    }
  });
  
  // Fetch columns data
  const {
    data: columnsData = [],
    isLoading: isColumnsLoading,
    isError: isColumnsError
  } = useQuery({
    queryKey: ['category-columns', id],
    queryFn: () => id ? getCategoryColumns(id) : [],
    enabled: !!id,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Error loading columns:', error);
          toast.error('Sütun məlumatlarını yükləyərkən xəta baş verdi');
        }
      }
    }
  });
  
  // Update the loading state based on the query states
  useEffect(() => {
    setIsLoading(isCategoryLoading || isColumnsLoading);
  }, [isCategoryLoading, isColumnsLoading]);
  
  // Create a combined error flag
  const hasError = isCategoryError || isColumnsError;
  
  if (isLoading) {
    return (
      <Layout userRole="super-admin">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
        </div>
      </Layout>
    );
  }
  
  if (hasError || !categoryData) {
    return (
      <Layout userRole="super-admin">
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-red-500 mb-4">Məlumatları yükləyərkən xəta baş verdi.</p>
          <button 
            className="px-4 py-2 bg-infoline-blue text-white rounded hover:bg-infoline-dark-blue"
            onClick={() => window.location.reload()}
          >
            Yenidən cəhd edin
          </button>
        </div>
      </Layout>
    );
  }
  
  // Combine category data with columns data
  const category = {
    ...categoryData,
    columns: columnsData,
    deadline: new Date().toISOString() // Add dummy deadline to satisfy the type
  };
  
  return (
    <Layout userRole="super-admin">
      <CategoryDetailView category={category} />
    </Layout>
  );
};

export default CategoryDetails;
