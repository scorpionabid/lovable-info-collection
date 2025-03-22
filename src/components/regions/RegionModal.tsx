
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as regionService from '@/services/supabase/region/index';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CreateRegionDto } from '@/lib/supabase/types/region';

// Define schema for region form
const regionSchema = z.object({
  name: z.string().min(2, 'Region name is required (min 2 characters)'),
  code: z.string().optional(),
  description: z.string().optional(),
});

type RegionFormValues = z.infer<typeof regionSchema>;

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  regionId?: string;
  onSuccess?: () => void;
}

export const RegionModal: React.FC<RegionModalProps> = ({
  isOpen,
  onClose,
  regionId,
  onSuccess,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!regionId;
  
  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegionFormValues>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  });
  
  // Load region data if in edit mode
  React.useEffect(() => {
    const loadRegion = async () => {
      if (isEditMode && regionId) {
        try {
          const regionData = await regionService.getRegionById(regionId);
          reset({
            name: regionData.name,
            code: regionData.code || '',
            description: regionData.description || '',
          });
        } catch (error) {
          console.error('Error loading region:', error);
          toast({
            title: 'Error',
            description: 'Failed to load region details',
            variant: 'destructive',
          });
          onClose();
        }
      }
    };
    
    if (isOpen) {
      loadRegion();
    }
  }, [isOpen, isEditMode, regionId, reset, toast, onClose]);
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateRegionDto) => regionService.createRegion(data as CreateRegionDto),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Region created successfully' });
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      reset();
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to create region: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: RegionFormValues) => 
      regionService.updateRegion(regionId as string, data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Region updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      queryClient.invalidateQueries({ queryKey: ['region', regionId] });
      reset();
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update region: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Submit handler
  const onSubmit = async (data: RegionFormValues) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      // Ensure data has name for createRegion
      const createData: CreateRegionDto = {
        name: data.name,
        code: data.code,
        description: data.description
      };
      createMutation.mutate(createData);
    }
  };
  
  return (
    <Modal
      title={isEditMode ? 'Edit Region' : 'Create New Region'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Region Name *
          </label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter region name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="code" className="block text-sm font-medium">
            Region Code
          </label>
          <Input
            id="code"
            {...register('code')}
            placeholder="Enter region code (optional)"
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Enter region description (optional)"
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
          >
            {isSubmitting || createMutation.isPending || updateMutation.isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditMode ? 'Update' : 'Create'}</>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RegionModal;
