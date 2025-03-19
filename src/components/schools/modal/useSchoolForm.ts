
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { School, CreateSchoolDto } from '@/services/supabase/school/types';
import { useSchoolHelpers } from './useSchoolHelpers';

interface SchoolType {
  id: string;
  name: string;
}

export const useSchoolForm = ({ mode, school, onSchoolUpdated, onClose }: {
  mode: 'create' | 'edit';
  school?: School;
  onSchoolUpdated?: () => void;
  onClose?: () => void;
}) => {
  const [formData, setFormData] = useState<CreateSchoolDto>({
    name: '',
    type: '',
    region_id: '',
    sector_id: '',
    studentCount: 0,
    teacherCount: 0,
    address: '',
    contactEmail: '',
    contactPhone: '',
    status: 'active',
    director: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState<{ id: string; name: string; }[]>([]);
  const [sectors, setSectors] = useState<{ id: string; name: string; }[]>([]);
  const [types, setTypes] = useState<{ id: string; name: string; }[]>([]);
  const { clearFormErrorsOnChange, validateForm, getErrorMessage, formErrors, setFormErrors } = useSchoolHelpers();
  const navigate = useNavigate();

  useEffect(() => {
    // If editing, populate the form with existing data
    if (mode === 'edit' && school) {
      setFormData({
        name: school.name,
        type: school.type || '',
        region_id: school.region_id,
        sector_id: school.sector_id || '',
        studentCount: school.studentCount,
        teacherCount: school.teacherCount,
        address: school.address || '',
        contactEmail: school.contactEmail,
        contactPhone: school.contactPhone,
        status: school.status,
        director: school.director || ''
      });
    }
    
    // Fetch lookup data
    const fetchLookupData = async () => {
      try {
        // Fetch regions
        const { data: regionsData, error: regionsError } = await supabase
          .from('regions')
          .select('id, name')
          .order('name');
        
        if (regionsError) {
          console.error('Error fetching regions:', regionsError);
          toast.error('Bölgə məlumatları yüklənərkən xəta baş verdi');
          return;
        }
        
        if (regionsData) {
          setRegions(regionsData);
        }
        
        // Fetch school types using rpc or direct query with error handling
        try {
          // First try a custom query to handle the school_types table
          const { data: typesData, error: typesError } = await supabase
            .rpc('get_school_types');
          
          if (typesError) {
            // Fallback to a raw SQL query
            console.log('RPC failed, falling back to raw query:', typesError);
            const { data, error } = await supabase.rpc('get_school_type_list');
            
            if (error) {
              console.error('Error fetching school types with rpc:', error);
              // As a third fallback, attempt a direct query to the table
              const rawResponse = await supabase.from('school_types').select('id, name').order('name');
              
              if (rawResponse.error) {
                console.error('All methods to fetch school types failed:', rawResponse.error);
                setTypes([]);
                toast.error('Məktəb tipləri yüklənərkən xəta baş verdi');
                return;
              }
              
              setTypes(rawResponse.data || []);
            } else if (data) {
              setTypes(data.map((type: SchoolType) => ({
                id: type.id,
                name: type.name
              })));
            }
          } else if (typesData) {
            setTypes(typesData.map((type: SchoolType) => ({
              id: type.id,
              name: type.name
            })));
          }
        } catch (typesError) {
          console.error('Error in school types fetch handling:', typesError);
          toast.error('Məktəb tipləri yüklənərkən xəta baş verdi');
          setTypes([]);
        }
      } catch (error) {
        console.error('Error fetching lookup data', error);
        toast.error('Məlumatlar yüklənərkən xəta baş verdi');
      }
    };
    
    fetchLookupData();
  }, [mode, school]);
  
  // Fetch sectors when region changes
  useEffect(() => {
    if (!formData.region_id) {
      setSectors([]);
      return;
    }
    
    const fetchSectors = async () => {
      try {
        const { data, error } = await supabase
          .from('sectors')
          .select('id, name')
          .eq('region_id', formData.region_id)
          .order('name');
        
        if (error) {
          console.error('Error fetching sectors:', error);
          setSectors([]);
          toast.error('Sektor məlumatları yüklənərkən xəta baş verdi');
          return;
        }
        
        if (data) {
          setSectors(data);
        } else {
          setSectors([]);
        }
      } catch (error) {
        console.error('Error fetching sectors', error);
        setSectors([]);
      }
    };
    
    fetchSectors();
  }, [formData.region_id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric values to numbers
    const val = type === 'number' ? (value ? parseInt(value, 10) : 0) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
    
    // Clear errors for this field when it changes
    clearFormErrorsOnChange(name);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data
    if (!validateForm(formData)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'create') {
        // Create new school
        const { data, error } = await supabase
          .from('schools')
          .insert({
            name: formData.name,
            type_id: formData.type,
            region_id: formData.region_id,
            sector_id: formData.sector_id || null,
            student_count: formData.studentCount,
            teacher_count: formData.teacherCount,
            address: formData.address,
            contact_email: formData.contactEmail,
            contact_phone: formData.contactPhone,
            status: formData.status,
            director: formData.director
          })
          .select()
          .single();
          
        if (error) throw error;
        
        toast.success('Məktəb uğurla yaradıldı');
        navigate(`/schools/${data.id}`);
      } else if (mode === 'edit' && school) {
        // Update existing school
        const { error } = await supabase
          .from('schools')
          .update({
            name: formData.name,
            type_id: formData.type,
            region_id: formData.region_id,
            sector_id: formData.sector_id || null,
            student_count: formData.studentCount,
            teacher_count: formData.teacherCount,
            address: formData.address,
            contact_email: formData.contactEmail,
            contact_phone: formData.contactPhone,
            status: formData.status,
            director: formData.director
          })
          .eq('id', school.id);
          
        if (error) throw error;
        
        toast.success('Məktəb məlumatları uğurla yeniləndi');
        
        if (onSchoolUpdated) {
          onSchoolUpdated();
        }
        
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error saving school:', error);
      toast.error('Məktəb məlumatları saxlanılmadı');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    regions,
    sectors,
    types,
    formErrors,
    getErrorMessage
  };
};
