
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner";
import { schoolSchema, SchoolFormValues } from './types';
import { createSchool, updateSchool } from "@/services/supabase/schoolService";
import { getRegionsForDropdown } from "@/services/supabase/sector/helperFunctions";
import { getSectorsByRegionId } from "@/services/supabase/sector/helperFunctions";
import { getSchoolTypes } from "@/services/supabase/school/helperFunctions";

export const useSchoolForm = (
  mode: 'create' | 'edit',
  school?: any,
  onSchoolCreated?: () => void,
  onSchoolUpdated?: () => void,
  onClose?: () => void
) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regions, setRegions] = useState<Array<{id: string, name: string}>>([]);
  const [sectors, setSectors] = useState<Array<{id: string, name: string}>>([]);
  const [schoolTypes, setSchoolTypes] = useState<Array<{id: string, name: string}>>([]);
  
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: school?.name || '',
      type: school?.type || '',
      regionId: school?.region_id || '',
      sectorId: school?.sector_id || '',
      studentCount: school?.studentCount || 0,
      teacherCount: school?.teacherCount || 0,
      address: school?.address || '',
      contactEmail: school?.contactEmail || '',
      contactPhone: school?.contactPhone || '',
      status: school?.status || 'Aktiv'
    }
  });
  
  // Watch for region changes to load sectors
  const watchedRegionId = form.watch('regionId');
  
  // Reset sector selection when region changes
  useEffect(() => {
    if (watchedRegionId) {
      form.setValue('sectorId', '');
    }
  }, [watchedRegionId, form]);
  
  // Load school types when component mounts
  useEffect(() => {
    const loadSchoolTypes = async () => {
      try {
        const data = await getSchoolTypes();
        console.log('Loaded school types:', data);
        setSchoolTypes(data);
      } catch (error) {
        console.error('Error loading school types:', error);
        toast.error("Məktəb növləri yüklənərkən xəta baş verdi", {
          description: "Zəhmət olmasa yenidən cəhd edin"
        });
      }
    };
    
    loadSchoolTypes();
  }, []);
  
  // Load regions when component mounts
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const data = await getRegionsForDropdown();
        setRegions(data);
      } catch (error) {
        console.error('Error loading regions:', error);
        toast.error("Regionlar yüklənərkən xəta baş verdi", {
          description: "Zəhmət olmasa yenidən cəhd edin"
        });
      }
    };
    
    loadRegions();
  }, []);
  
  // Load sectors when a region is selected
  useEffect(() => {
    const loadSectors = async () => {
      if (!watchedRegionId) {
        setSectors([]);
        return;
      }
      
      try {
        const sectorData = await getSectorsByRegionId(watchedRegionId);
        setSectors(sectorData);
      } catch (error) {
        console.error('Error loading sectors:', error);
        toast.error("Sektorlar yüklənərkən xəta baş verdi", {
          description: "Zəhmət olmasa yenidən cəhd edin"
        });
      }
    };
    
    loadSectors();
  }, [watchedRegionId]);
  
  const onSubmit = async (data: SchoolFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Validate that we have valid UUIDs for required fields
      if (!data.type || !data.regionId || !data.sectorId) {
        toast.error("Məcburi sahələri doldurun", {
          description: "Məktəb növü, region və sektor seçilməlidir"
        });
        return;
      }
      
      // Log the form data for debugging
      console.log('Form data before submission:', data);
      
      if (mode === 'create') {
        // Create the school with properly formatted data
        await createSchool({
          name: data.name,
          type: data.type, // This should be a valid UUID now
          region_id: data.regionId,
          sector_id: data.sectorId,
          region: '', // These will be filled by the backend
          sector: '', // These will be filled by the backend
          studentCount: data.studentCount || 0,
          teacherCount: data.teacherCount || 0,
          address: data.address,
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          status: data.status || 'Aktiv'
        });
        
        toast.success("Məktəb uğurla yaradıldı");
        
        if (onSchoolCreated) {
          onSchoolCreated();
        }
      } else {
        if (school?.id) {
          // Update the school with properly formatted data
          await updateSchool(school.id, {
            name: data.name,
            type: data.type,
            region_id: data.regionId,
            sector_id: data.sectorId,
            studentCount: data.studentCount || 0,
            teacherCount: data.teacherCount || 0,
            address: data.address,
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            status: data.status || 'Aktiv'
          });
          
          toast.success("Məktəb uğurla yeniləndi");
          
          if (onSchoolUpdated) {
            onSchoolUpdated();
          }
        }
      }
      
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error('Error submitting school:', error);
      toast.error("Məktəb məlumatları yadda saxlanılmadı", {
        description: "Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    regions,
    sectors,
    schoolTypes,
    watchedRegionId,
    onSubmit
  };
};
