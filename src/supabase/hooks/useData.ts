
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getData, 
  getDataById, 
  createData, 
  updateData, 
  deleteData,
  CreateDataDto,
  UpdateDataDto
} from '../services/data';

export const useData = () => {
  const queryClient = useQueryClient();

  // Fetch all data entries
  const {
    data = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['data'],
    queryFn: getData
  });

  // Fetch data entry by ID
  const useDataById = (id: string) => {
    return useQuery({
      queryKey: ['data', id],
      queryFn: () => getDataById(id),
      enabled: !!id
    });
  };

  // Create data mutation
  const createDataMutation = useMutation({
    mutationFn: (data: CreateDataDto) => createData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
      toast.success('Məlumat uğurla yaradıldı');
    },
    onError: (error: any) => {
      toast.error(`Məlumat yaradılarkən xəta: ${error.message}`);
    }
  });

  // Update data mutation
  const updateDataMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDataDto }) => updateData(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
      toast.success('Məlumat uğurla yeniləndi');
    },
    onError: (error: any) => {
      toast.error(`Məlumat yenilənərkən xəta: ${error.message}`);
    }
  });

  // Delete data mutation
  const deleteDataMutation = useMutation({
    mutationFn: (id: string) => deleteData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
      toast.success('Məlumat uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Məlumat silinərkən xəta: ${error.message}`);
    }
  });

  return {
    // Queries
    data,
    isLoading,
    isError,
    refetch,
    useDataById,
    
    // Mutations
    createData: createDataMutation.mutate,
    updateData: updateDataMutation.mutate,
    deleteData: deleteDataMutation.mutate,
    
    // Loading states
    isCreatingData: createDataMutation.isPending,
    isUpdatingData: updateDataMutation.isPending,
    isDeletingData: deleteDataMutation.isPending
  };
};
