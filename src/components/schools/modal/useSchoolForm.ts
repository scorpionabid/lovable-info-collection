
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner";
import { schoolSchema, SchoolFormValues } from './types';
import { createSchool, updateSchool } from "@/services/supabase/schoolService";
import { getRegionsForDropdown } from "@/services/supabase/sector/helperFunctions";

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
      status: school?.status || 'Aktiv',
      directorFirstName: '',
      directorLastName: '',
      directorEmail: '',
      directorPhone: '',
    }
  });
  
  // Watch for region changes to load sectors
  const watchedRegionId = form.watch('regionId');
  
  // Load regions when component mounts
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const data = await getRegionsForDropdown();
        setRegions(data);
      } catch (error) {
        console.error('Error loading regions:', error);
        toast("Regionlar yüklənərkən xəta baş verdi", {
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
        // This would be replaced with a call to get sectors by region ID
        // For now, using mock data
        const sectorsMock = [
          { id: '1', name: 'Nəsimi rayonu' },
          { id: '2', name: 'Yasamal rayonu' },
          { id: '3', name: 'Sabunçu rayonu' },
          { id: '4', name: 'Mərkəz' },
        ];
        setSectors(sectorsMock);
      } catch (error) {
        console.error('Error loading sectors:', error);
        toast("Sektorlar yüklənərkən xəta baş verdi", {
          description: "Zəhmət olmasa yenidən cəhd edin"
        });
      }
    };
    
    loadSectors();
  }, [watchedRegionId]);
  
  const onSubmit = async (data: SchoolFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Combine director names for the API
      const directorName = `${data.directorFirstName} ${data.directorLastName}`;
      
      if (mode === 'create') {
        // Create the school with properly formatted data
        await createSchool({
          name: data.name,
          type: data.type,
          region_id: data.regionId,
          sector_id: data.sectorId,
          region: '', // These will be filled by the backend
          sector: '', // These will be filled by the backend
          studentCount: data.studentCount,
          teacherCount: data.teacherCount,
          address: data.address,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          status: data.status,
          director: directorName
        });
        
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
            studentCount: data.studentCount,
            teacherCount: data.teacherCount,
            address: data.address,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            status: data.status,
            director: directorName
          });
          
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
      toast("Məktəb məlumatları yadda saxlanılmadı", {
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
    watchedRegionId,
    onSubmit
  };
};
