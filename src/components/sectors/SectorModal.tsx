import React from 'react';
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectorWithStats } from "@/services/supabase/sector/types";
import { createSector, updateSector } from "@/services/supabase/sector";
import { useToast } from "@/hooks/use-toast";

export interface SectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  sector?: any; // The sector data for edit mode
  sectorId?: string; // Alternative way to specify the sector
  onSuccess?: () => void;
}

export const SectorModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  sector, 
  sectorId,
  onSuccess 
}: SectorModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    regionId: "",
  });

  useEffect(() => {
    if (mode === "edit" && sector) {
      setFormData({
        name: sector.name,
        description: sector.description || "",
        regionId: sector.region_id,
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        description: "",
        regionId: "",
      });
    }
  }, [mode, sector]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Xəta",
        description: "Sektor adını daxil edin",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (mode === "create") {
        await createSector({
          name: formData.name,
          description: formData.description,
          region_id: formData.regionId,
        });
        
        toast({
          title: "Uğurlu",
          description: "Sektor uğurla yaradıldı",
        });
      } else if (mode === "edit") {
        await updateSector(sector.id, {
          name: formData.name,
          description: formData.description,
          region_id: formData.regionId,
        });
        
        toast({
          title: "Uğurlu",
          description: "Sektor uğurla yeniləndi",
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error("Sector operation failed:", error);
      toast({
        title: "Xəta",
        description: "Əməliyyat zamanı xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Yeni Sektor Yarat" : "Sektoru Redaktə Et"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Sektor adı</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Sektor adını daxil edin"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Təsvir</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Təsvir daxil edin (istəyə bağlı)"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Ləğv et
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Gözləyin..."
                : mode === "create"
                ? "Yarat"
                : "Yadda saxla"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
