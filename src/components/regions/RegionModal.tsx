
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegionWithStats } from "@/services/supabase/regionService";
import regionService from "@/services/supabase/regionService";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoTab } from './modals/BasicInfoTab';
import { AdminTab } from './modals/AdminTab';
import { ConfigTab } from './modals/ConfigTab';
import { ModalHeader } from './modals/ModalHeader';
import { ModalFooter } from './modals/ModalFooter';

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  region?: RegionWithStats;
  onSuccess?: () => void;
}

export const RegionModal = ({ isOpen, onClose, mode, region, onSuccess }: RegionModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    adminId: '',
  });

  // Initialize form data when modal opens or region changes
  useEffect(() => {
    if (mode === 'edit' && region) {
      setFormData({
        name: region.name || '',
        code: region.code || '',
        description: region.description || '',
        adminId: '',
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        code: '',
        description: '',
        adminId: '',
      });
    }
  }, [mode, region, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (mode === 'create') {
        await regionService.createRegion({
          name: formData.name,
          code: formData.code,
          description: formData.description,
        });
        
        toast({
          title: "Region yaradıldı",
          description: "Yeni region uğurla yaradıldı",
        });
      } else if (mode === 'edit' && region) {
        await regionService.updateRegion(region.id, {
          name: formData.name,
          code: formData.code,
          description: formData.description,
        });
        
        toast({
          title: "Region yeniləndi",
          description: "Region məlumatları uğurla yeniləndi",
        });
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} region:`, error);
      toast({
        title: "Xəta",
        description: `Region ${mode === 'create' ? 'yaradılarkən' : 'yenilənərkən'} xəta baş verdi`,
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
          title={mode === 'create' ? 'Yeni Region Yarat' : 'Regionu Redaktə Et'}
          onClose={onClose}
        />
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Əsas Məlumatlar</TabsTrigger>
              <TabsTrigger value="admin">Region Admini</TabsTrigger>
              <TabsTrigger value="config">Konfiqurasiya</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="basic">
                <BasicInfoTab formData={formData} handleChange={handleChange} />
              </TabsContent>
              
              <TabsContent value="admin">
                <AdminTab formData={formData} handleSelectChange={handleSelectChange} />
              </TabsContent>
              
              <TabsContent value="config">
                <ConfigTab />
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
