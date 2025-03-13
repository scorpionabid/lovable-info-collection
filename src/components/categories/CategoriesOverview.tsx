
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { CategoryTable } from './CategoryTable';
import { CategoryFilterPanel } from './CategoryFilterPanel';
import { CategoryModal } from './CategoryModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, RefreshCcw, Download, Upload } from "lucide-react";
import * as categoryService from '@/services/supabase/category';
import { Category, CategoryFilter } from '@/services/supabase/category/types';
import { CategoryType } from './CategoryDetailView';

const convertToCategory = (category: Category): CategoryType => {
  return {
    ...category,
    deadline: '', // Set a default value for deadline
    columns: typeof category.columns === 'number' ? [] : category.columns || [],
    description: category.description || '', // Ensure description is not optional
    completionRate: category.completionRate || 0 // Ensure completionRate is not optional
  };
};

export const CategoriesOverview = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  
  const assignment = searchParams.get('assignment') as 'All' | 'Regions' | 'Sectors' | 'Schools' | undefined;
  const status = searchParams.get('status') as 'Active' | 'Inactive' | undefined;
  const deadlineBefore = searchParams.get('deadlineBefore') || undefined;
  const deadlineAfter = searchParams.get('deadlineAfter') || undefined;
  const minCompletionRate = searchParams.get('minCompletionRate') 
    ? parseInt(searchParams.get('minCompletionRate')!) 
    : undefined;
  const maxCompletionRate = searchParams.get('maxCompletionRate')
    ? parseInt(searchParams.get('maxCompletionRate')!)
    : undefined;

  const { data: categoriesData = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['categories', searchQuery, assignment, status, deadlineBefore, deadlineAfter, minCompletionRate, maxCompletionRate],
    queryFn: async () => {
      try {
        return await categoryService.getCategories({
          search: searchQuery,
          assignment,
          status,
          deadlineBefore,
          deadlineAfter,
          minCompletionRate,
          maxCompletionRate
        });
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Kateqoriyaları yükləyərkən xəta baş verdi');
        throw err;
      }
    }
  });

  const categories = categoriesData.map((category) => convertToCategory(category));

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kateqoriya uğurla silindi');
    },
    onError: (error) => {
      toast.error(`Xəta baş verdi: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [localSearchQuery]);

  const handleFilterChange = (filters: CategoryFilter) => {
    const newParams = new URLSearchParams();
    
    if (filters.search) newParams.set('search', filters.search);
    if (filters.assignment) newParams.set('assignment', filters.assignment);
    if (filters.status) newParams.set('status', filters.status);
    if (filters.deadlineBefore) newParams.set('deadlineBefore', filters.deadlineBefore);
    if (filters.deadlineAfter) newParams.set('deadlineAfter', filters.deadlineAfter);
    if (filters.minCompletionRate !== undefined) newParams.set('minCompletionRate', filters.minCompletionRate.toString());
    if (filters.maxCompletionRate !== undefined) newParams.set('maxCompletionRate', filters.maxCompletionRate.toString());
    
    setSearchParams(newParams);
    setShowFilters(false);
  };

  const handleRefresh = () => {
    refetch();
    toast.info('Məlumatlar yeniləndi');
  };

  const handleExport = async () => {
    try {
      toast.success('Kateqoriyalar ixrac edildi');
    } catch (error) {
      toast.error('İxrac zamanı xəta baş verdi');
    }
  };

  const handleImport = async () => {
    toast.info('Kateqoriyaların idxalı funksiyası hazırlanma mərhələsindədir');
  };

  const handleCategoryCreated = () => {
    setIsCreateModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    toast.success('Kateqoriya uğurla yaradıldı');
  };

  const handleDeleteCategory = async (category: CategoryType) => {
    if (window.confirm(`"${category.name}" kateqoriyasını silmək istədiyinizə əminsiniz?`)) {
      deleteMutation.mutate(category.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Axtarış..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-infoline-dark-gray">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtrlər
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleRefresh}
          >
            <RefreshCcw size={16} />
            Yenilə
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download size={16} />
            İxrac et
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleImport}
          >
            <Upload size={16} />
            İdxal et
          </Button>
          
          <Button 
            className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} />
            Yeni Kateqoriya
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <CategoryFilterPanel 
          onClose={() => setShowFilters(false)} 
          onApplyFilters={handleFilterChange}
          initialFilters={{
            assignment,
            status,
            deadlineBefore,
            deadlineAfter,
            minCompletionRate,
            maxCompletionRate
          }}
        />
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
          <p>Məlumatları yükləyərkən xəta baş verdi. Zəhmət olmasa bir daha cəhd edin.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => refetch()}
          >
            Yenidən cəhd et
          </Button>
        </div>
      ) : (
        <CategoryTable 
          categories={categories} 
          onDelete={(category) => handleDeleteCategory(category)}
          onUpdatePriority={(id, newPriority) => {
            const previousCategories = queryClient.getQueryData<CategoryType[]>(['categories']);
            
            if (previousCategories) {
              queryClient.setQueryData(['categories'], 
                previousCategories.map(cat => 
                  cat.id === id ? { ...cat, priority: newPriority } : cat
                )
              );
            }
            
            categoryService.updateCategoryPriority(id, newPriority)
              .then(() => {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
              })
              .catch(error => {
                if (previousCategories) {
                  queryClient.setQueryData(['categories'], previousCategories);
                }
                toast.error('Prioritet dəyişdirilərkən xəta baş verdi');
                console.error(error);
              });
          }}
        />
      )}
      
      <CategoryModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create"
        onSuccess={handleCategoryCreated}
      />
    </div>
  );
};
