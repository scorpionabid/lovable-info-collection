
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { CategoryDetailView } from '@/components/categories/CategoryDetailView';
import { getCategoryById, updateCategory, deleteCategory } from '@/services/api/categoryService';
import { CategoryType } from '@/components/categories/types';

const CategoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: category, isLoading, isError } = useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id as string),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateCategory(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      toast.success('Kateqoriya məlumatları uğurla yeniləndi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error?.message || 'Kateqoriya yenilənərkən xəta baş verdi'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCategory(id as string),
    onSuccess: () => {
      toast.success('Kateqoriya uğurla silindi');
      navigate('/categories');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error?.message || 'Kateqoriya silinərkən xəta baş verdi'}`);
    }
  });

  const handleDelete = async () => {
    if (window.confirm('Bu kateqoriyanı silmək istədiyinizə əminsiniz?')) {
      setLoading(true);
      try {
        await deleteMutation.mutateAsync();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoBack = () => {
    navigate('/categories');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
        </div>
      </Layout>
    );
  }

  if (isError || !category) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p className="font-semibold">Kateqoriya məlumatlarını yükləyərkən xəta baş verdi</p>
          <p className="mt-2">Zəhmət olmasa bir az sonra yenidən cəhd edin və ya sistem administratoru ilə əlaqə saxlayın.</p>
          <Button className="mt-4" onClick={handleGoBack}>Geri qayıt</Button>
        </div>
      </Layout>
    );
  }

  // Ensure createdAt is not optional by providing a default
  const categoryWithDefaults: CategoryType = {
    ...category,
    columns: Array.isArray(category.columns) ? category.columns : [],
    deadline: category.deadline || new Date().toISOString(),
    description: category.description || '',
    completionRate: category.completionRate || 0,
    createdAt: category.createdAt || category.created_at || new Date().toISOString()
  };

  return (
    <Layout>
      <CategoryDetailView
        category={categoryWithDefaults}
        onGoBack={handleGoBack}
        isLoading={updateMutation.isPending || deleteMutation.isPending || loading}
        onDeleteCategory={handleDelete}
      />
    </Layout>
  );
};

export default CategoryDetails;
