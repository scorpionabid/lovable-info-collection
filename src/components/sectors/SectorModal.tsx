
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RegionWithStats } from '@/services/supabase/region/types';
import { Loader2 } from 'lucide-react';

export interface SectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  region?: RegionWithStats;
  sectorId?: string;
  onSuccess?: () => void;
}

export const SectorModal = ({ isOpen, onClose, mode, region, sectorId, onSuccess }: SectorModalProps) => {
  const [sectorName, setSectorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!sectorName.trim()) {
      setError('Sector name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a real app, this would make an API call
      console.log('Creating sector:', {
        name: sectorName,
        regionId: region?.id
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (err) {
      console.error('Error creating sector:', err);
      setError('Failed to create sector. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Sector' : 'Edit Sector'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? `Add a new sector to ${region?.name || 'the region'}`
              : 'Update sector information'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sector-name">Sector Name</Label>
              <Input
                id="sector-name"
                placeholder="Enter sector name"
                value={sectorName}
                onChange={(e) => setSectorName(e.target.value)}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                mode === 'create' ? 'Create Sector' : 'Update Sector'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
