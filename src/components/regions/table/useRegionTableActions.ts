
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteRegion, archiveRegion } from '@/services/supabase/region/regionOperations';
import { Region } from '@/lib/supabase/types';

export const useRegionTableActions = (onRefresh: () => void) => {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const handleArchive = async (region: Region) => {
    if (actionInProgress) return;
    
    setActionInProgress(region.id);
    try {
      await archiveRegion(region.id);
      toast.success(`"${region.name}" has been archived`);
      onRefresh();
    } catch (error) {
      console.error('Error archiving region:', error);
      toast.error('Failed to archive region');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (region: Region) => {
    if (actionInProgress) return;
    
    setActionInProgress(region.id);
    try {
      await deleteRegion(region.id);
      toast.success(`"${region.name}" has been deleted`);
      onRefresh();
    } catch (error) {
      console.error('Error deleting region:', error);
      toast.error('Failed to delete region');
    } finally {
      setActionInProgress(null);
    }
  };

  return {
    actionInProgress,
    handleArchive,
    handleDelete
  };
};

export default useRegionTableActions;
