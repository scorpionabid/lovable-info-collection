import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { ModalHeader } from '../regions/modals/ModalHeader';
import { ModalFooter } from '../regions/modals/ModalFooter';
import { SectorWithStats } from '@/services/supabase/sector/types';
import sectorService from '@/services/supabase/sectorService';
import { useToast } from '@/hooks/use-toast';

interface SectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  sector?: SectorWithStats;
  onSuccess?: () => void;
}

interface SectorFormData {
  name: string;
  description: string;
  regionId: string;
  adminId: string;
}

export const SectorModal = ({ isOpen, onClose, mode, sector, onSuccess }: SectorModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<SectorFormData>({
    defaultValues: {
      name: sector?.name || '',
      description: sector?.description || '',
      regionId: sector?.region_id || '',
      adminId: '',
    }
  });

  // Fetch regions for dropdown
  const { data: regions = [] } = useQuery({
    queryKey: ['regions-dropdown'],
    queryFn: () => sectorService.getRegionsForDropdown(),
    enabled: isOpen,
  });

  // Reset form when modal opens with sector data
  useEffect(() => {
    if (isOpen && mode === 'edit' && sector) {
      reset({
        name: sector.name,
        description: sector.description || '',
        regionId: sector.region_id,
        adminId: '',
      });
    } else if (isOpen && mode === 'create') {
      reset({
        name: '',
        description: '',
        regionId: '',
        adminId: '',
      });
    }
  }, [isOpen, mode, sector, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: SectorFormData) => {
    try {
      setIsSubmitting(true);
      
      if (mode === 'create') {
        await sectorService.createSector({
          name: data.name,
          description: data.description,
          region_id: data.regionId,
        });
      } else if (mode === 'edit' && sector) {
        await sectorService.updateSector(sector.id, {
          name: data.name,
          description: data.description,
          region_id: data.regionId,
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Xəta baş verdi",
        description: error.message || "Sektor məlumatları saxlanıla bilmədi",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        <ModalHeader 
          title={mode === 'create' ? 'Yeni Sektor Yarat' : 'Sektoru Redaktə Et'} 
          onClose={onClose} 
        />
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Əsas Məlumatlar</TabsTrigger>
              <TabsTrigger value="admin">Sektor Admini</TabsTrigger>
              <TabsTrigger value="config">Konfiqurasiya</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Sektor adı *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Sektor adı tələb olunur" })}
                    placeholder="Sektor adını daxil edin"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Təsvir</Label>
                  <Input
                    id="description"
                    {...register("description")}
                    placeholder="Sektor haqqında qısa məlumat"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regionSelect">Region *</Label>
                  <Select
                    defaultValue={sector?.region_id}
                    onValueChange={(value) => setValue("regionId", value)}
                  >
                    <SelectTrigger id="regionSelect" className={errors.regionId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Region seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.regionId && (
                    <p className="text-red-500 text-sm">{errors.regionId.message}</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminSelect">Sektor Admini</Label>
                  <Select
                    onValueChange={(value) => setValue("adminId", value)}
                  >
                    <SelectTrigger id="adminSelect">
                      <SelectValue placeholder="Sektor Admini seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Yeni admin yarat</SelectItem>
                      <SelectItem value="user1">Elşən Məmmədov</SelectItem>
                      <SelectItem value="user2">Aynur Əliyeva</SelectItem>
                      <SelectItem value="user3">Kamran Hüseynov</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* {formData.adminId === 'new' && ( */}
                {/*  <div className="space-y-4 border p-4 rounded-md border-infoline-light-gray mt-4"> */}
                {/*    <h3 className="font-medium text-infoline-dark-blue">Yeni Admin Yarat</h3> */}
                    
                {/*    <div className="grid grid-cols-2 gap-4"> */}
                {/*      <div className="space-y-2"> */}
                {/*        <Label htmlFor="adminName">Ad</Label> */}
                {/*        <Input id="adminName" placeholder="Adı daxil edin" /> */}
                {/*      </div> */}
                {/*      <div className="space-y-2"> */}
                {/*        <Label htmlFor="adminSurname">Soyad</Label> */}
                {/*        <Input id="adminSurname" placeholder="Soyadı daxil edin" /> */}
                {/*      </div> */}
                {/*    </div> */}
                    
                {/*    <div className="space-y-2"> */}
                {/*      <Label htmlFor="adminEmail">Email</Label> */}
                {/*      <Input id="adminEmail" type="email" placeholder="Email ünvanını daxil edin" /> */}
                {/*    </div> */}
                    
                {/*    <div className="space-y-2"> */}
                {/*      <Label htmlFor="adminPhone">Telefon</Label> */}
                {/*      <Input id="adminPhone" placeholder="Telefon nömrəsini daxil edin" /> */}
                {/*    </div> */}
                {/*  </div> */}
                {/* )} */}
              </TabsContent>
              
              <TabsContent value="config" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationLevel">Bildiriş səviyyəsi</Label>
                  <Select>
                    <SelectTrigger id="notificationLevel">
                      <SelectValue placeholder="Bildiriş səviyyəsini seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Yüksək</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="low">Aşağı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Son tarix</Label>
                  <Input id="deadline" type="date" />
                </div>
              </TabsContent>
              
              <ModalFooter 
                onClose={onClose} 
                isSubmitting={isSubmitting} 
                mode={mode} 
              />
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
