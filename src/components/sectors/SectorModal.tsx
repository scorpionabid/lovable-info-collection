
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

export interface SectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  sector?: any; // Sector data for edit mode
  onSuccess?: () => void;
  regionId?: string; // Added for RegionDetails.tsx
}

export const SectorModal: React.FC<SectorModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  sector,
  onSuccess,
  regionId
}) => {
  const [name, setName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If editing, set initial values
    if (mode === 'edit' && sector) {
      setName(sector.name || '');
      setSelectedRegion(sector.region_id || '');
    }
    
    // If creating from region details page, use provided regionId
    if (mode === 'create' && regionId) {
      setSelectedRegion(regionId);
    }

    // Load regions for dropdown
    const fetchRegions = async () => {
      try {
        const { data, error } = await supabase
          .from('regions')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setRegions(data || []);
      } catch (error) {
        console.error('Error loading regions:', error);
        toast.error('Failed to load regions');
      }
    };

    fetchRegions();
  }, [mode, sector, regionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim()) {
      toast.error('Sektor adı daxil edin');
      return;
    }
    
    if (!selectedRegion) {
      toast.error('Region seçin');
      return;
    }
    
    setLoading(true);
    
    try {
      if (mode === 'create') {
        // Create new sector
        const { error } = await supabase
          .from('sectors')
          .insert({
            name,
            region_id: selectedRegion
          });
        
        if (error) throw error;
        toast.success('Sektor yaradıldı');
      } else {
        // Update existing sector
        const { error } = await supabase
          .from('sectors')
          .update({
            name,
            region_id: selectedRegion
          })
          .eq('id', sector.id);
        
        if (error) throw error;
        toast.success('Sektor yeniləndi');
      }
      
      // Call onSuccess callback
      if (onSuccess) onSuccess();
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error saving sector:', error);
      toast.error('Əməliyyat zamanı xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Yeni sektor' : 'Sektoru redaktə et'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sector-name">Sektor adı</Label>
            <Input
              id="sector-name"
              placeholder="Sektor adını daxil edin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select
              value={selectedRegion}
              onValueChange={setSelectedRegion}
              disabled={loading || (mode === 'create' && !!regionId)}
            >
              <SelectTrigger id="region">
                <SelectValue placeholder="Region seçin" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Ləğv et
            </Button>
            <Button 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Yüklənir...' : mode === 'create' ? 'Yarat' : 'Yadda saxla'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
