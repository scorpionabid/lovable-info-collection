
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { createRegion, updateRegion } from '@/services/supabase/region/regionOperations';
import { useMutation } from '@tanstack/react-query';
import type { CreateRegionDto, UpdateRegionDto } from '@/lib/supabase/types';

export const useRegionMutation = () => {
  const createMutation = useMutation({
    mutationFn: (data: CreateRegionDto) => createRegion(data),
    onSuccess: () => {
      toast.success('Region created successfully');
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to create region: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRegionDto }) => updateRegion(id, data),
    onSuccess: () => {
      toast.success('Region updated successfully');
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update region: ${error.message}`);
    },
  });

  return {
    createRegion: createMutation.mutate,
    updateRegion: (id: string, data: UpdateRegionDto) => updateMutation.mutate({ id, data }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};

export default useRegionMutation;
