import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { CategoryDetailView } from '@/components/categories/CategoryDetailView';
import categoryService from '@/services/categoryService';

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: category, isLoading: queryIsLoading, isError } = useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategoryById(id || ''),
    enabled: !!id,
  });

  const updateMutation = useMutation(
    (data) => categoryService.updateCategory(id || '', data),
    {
      onSuccess: () => {
        toast.success('Kateqoriya uğurla yeniləndi!');
        queryClient.invalidateQueries(['categories']);
        queryClient.invalidateQueries(['category', id]);
      },
      onError: (error) => {
        toast.error(`Kateqoriya yenilənərkən xəta baş verdi: ${error.message}`);
      },
    }
  );

  const deleteMutation = useMutation(
    () => categoryService.deleteCategory(id || ''),
    {
      onSuccess: () => {
        toast.success('Kateqoriya uğurla silindi!');
        queryClient.invalidateQueries(['categories']);
        navigate('/categories');
      },
      onError: (error) => {
        toast.error(`Kateqoriya silinərkən xəta baş verdi: ${error.message}`);
      },
    }
  );

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

  if (queryIsLoading) {
    return <div>Yüklənir...</div>;
  }

  if (isError || !category) {
    return <div>Kateqoriya tapılmadı və ya xəta baş verdi.</div>;
  }

  // Ensure createdAt is not optional by providing a default
  const categoryWithDefaults = {
    id: category?.id || '',
    name: category?.name || '',
    description: category?.description || '',
    assignment: category?.assignment || 'All',
    columns: [],
    status: category?.status || 'Active',
    priority: category?.priority || 0,
    completionRate: 0,
    createdAt: category?.created_at || new Date().toISOString(),
    deadline: new Date().toISOString()
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
