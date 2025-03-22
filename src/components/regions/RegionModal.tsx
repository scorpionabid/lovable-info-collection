
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
import { RegionWithStats } from '@/lib/supabase/types/region';

// Define schema for region form
const regionSchema = z.object({
  name: z.string().min(2, 'Region name is required (min 2 characters)'),
  code: z.string().optional(),
  description: z.string().optional(),
});

type RegionFormValues = z.infer<typeof regionSchema>;

export interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: RegionWithStats;
  onSuccess?: () => void;
  onCreated?: () => void;
}

export const RegionModal: React.FC<RegionModalProps> = ({
  isOpen,
  onClose,
  mode = 'create',
  initialData,
  onSuccess,
  onCreated
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = mode === 'edit';
  
  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegionFormValues>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
    },
  });
  
  // Load region data if in edit mode
  React.useEffect(() => {
    const loadRegion = async () => {
      if (isEditMode && initialData?.id) {
        try {
          const regionData = await regionService.getRegionById(initialData.id);
          reset({
            name: regionData.name,
            code: regionData.code || '',
            description: regionData.description || '',
          });
        } catch (error) {
          console.error('Error loading region:', error);
          toast({
            title: 'Xəta',
            description: 'Region məlumatlarını yükləyərkən xəta baş verdi',
            variant: 'destructive',
          });
          onClose();
        }
      }
    };
    
    if (isOpen) {
      loadRegion();
    }
  }, [isOpen, isEditMode, initialData, reset, toast, onClose]);
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: RegionFormValues) => regionService.createRegion(data),
    onSuccess: () => {
      toast({ 
        title: 'Əməliyyat tamamlandı', 
        description: 'Region uğurla yaradıldı' 
      });
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      reset();
      onClose();
      if (onSuccess) onSuccess();
      if (onCreated) onCreated();
    },
    onError: (error: any) => {
      toast({
        title: 'Xəta',
        description: `Region yaradılarkən xəta: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: RegionFormValues) => 
      regionService.updateRegion(initialData?.id as string, data),
    onSuccess: () => {
      toast({ 
        title: 'Əməliyyat tamamlandı', 
        description: 'Region uğurla yeniləndi' 
      });
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      queryClient.invalidateQueries({ queryKey: ['region', initialData?.id] });
      reset();
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Xəta',
        description: `Region yenilənərkən xəta: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Submit handler
  const onSubmit = async (data: RegionFormValues) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  return (
    <Modal
      title={isEditMode ? 'Regionu Redaktə et' : 'Yeni Region Yarat'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Ad*
          </label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Kod
          </label>
          <Input
            id="code"
            {...register('code')}
            className={errors.code ? 'border-red-500' : ''}
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Təsvir
          </label>
          <Textarea
            id="description"
            {...register('description')}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Ləğv et
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saxlanılır...' : isEditMode ? 'Yenilə' : 'Yarat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RegionModal;
