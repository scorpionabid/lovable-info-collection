
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { toast } from 'sonner';
import { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  getCategoryColumns,
  createColumn,
  updateColumn,
  deleteColumn,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateColumnDto,
  UpdateColumnDto
} from '../services/categories';

export const useCategories = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: '',
    type: 'all'
  });

  // Fetch all categories
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['categories', filters],
    queryFn: async () => {
      const allCategories = await getCategories();
      
      // Apply client-side filtering
      return allCategories.filter(category => {
        // Search filter
        if (filters.search && !category.name.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        
        // Type filter
        if (filters.type !== 'all' && category.type !== filters.type) {
          return false;
        }
        
        return true;
      });
    }
  });

  // Fetch columns for a category
  const useCategoryColumns = (categoryId: string) => {
    return useQuery({
      queryKey: ['category-columns', categoryId],
      queryFn: () => getCategoryColumns(categoryId),
      enabled: !!categoryId
    });
  };

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kateqoriya uğurla yaradıldı');
    },
    onError: (error: any) => {
      toast.error(`Kateqoriya yaradılarkən xəta: ${error.message}`);
    }
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kateqoriya uğurla yeniləndi');
    },
    onError: (error: any) => {
      toast.error(`Kateqoriya yenilənərkən xəta: ${error.message}`);
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kateqoriya uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Kateqoriya silinərkən xəta: ${error.message}`);
    }
  });

  // Create column mutation
  const createColumnMutation = useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: CreateColumnDto }) => 
      createColumn(categoryId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['category-columns', variables.categoryId] });
      toast.success('Sütun uğurla yaradıldı');
    },
    onError: (error: any) => {
      toast.error(`Sütun yaradılarkən xəta: ${error.message}`);
    }
  });

  // Update column mutation
  const updateColumnMutation = useMutation({
    mutationFn: ({ id, data, categoryId }: { id: string; data: UpdateColumnDto; categoryId: string }) => 
      updateColumn(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['category-columns', variables.categoryId] });
      toast.success('Sütun uğurla yeniləndi');
    },
    onError: (error: any) => {
      toast.error(`Sütun yenilənərkən xəta: ${error.message}`);
    }
  });

  // Delete column mutation
  const deleteColumnMutation = useMutation({
    mutationFn: ({ id, categoryId }: { id: string; categoryId: string }) => deleteColumn(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['category-columns', variables.categoryId] });
      toast.success('Sütun uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Sütun silinərkən xəta: ${error.message}`);
    }
  });

  return {
    // Queries
    categories,
    isLoading,
    isError,
    refetch,
    useCategoryColumns,
    
    // Mutations
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    createColumn: createColumnMutation.mutate,
    updateColumn: updateColumnMutation.mutate,
    deleteColumn: deleteColumnMutation.mutate,
    
    // Loading states
    isCreatingCategory: createCategoryMutation.isPending,
    isUpdatingCategory: updateCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,
    isCreatingColumn: createColumnMutation.isPending,
    isUpdatingColumn: updateColumnMutation.isPending,
    isDeletingColumn: deleteColumnMutation.isPending,
    
    // Filters
    filters,
    setFilters
  };
};
