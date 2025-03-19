
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { School, CreateSchoolDto } from '@/services/supabase/school/types';
import { useSchoolHelpers } from './useSchoolHelpers';

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
        const { data: regionsData } = await supabase
          .from('regions')
          .select('id, name')
          .order('name');
        
        if (regionsData) {
          setRegions(regionsData);
        }
        
        // Fetch school types
        // Use a raw query or direct table name to handle "school_types" table
        // since it's not in the type definitions
        const schoolTypesResponse = await supabase
          .rpc('get_school_types') // Use a stored procedure if available
          .select('id, name');

        if (schoolTypesResponse.data && !schoolTypesResponse.error) {
          setTypes(schoolTypesResponse.data.map(type => ({
            id: type.id,
            name: type.name
          })));
        } else {
          // Fallback to direct query with error handling
          const { data, error } = await supabase.from('school_types')
            .select('id, name')
            .order('name');
            
          if (error) {
            console.error('Error fetching school types:', error);
            setTypes([]);
          } else if (data) {
            // Manually map the data with type safety
            const typesArray: {id: string; name: string}[] = [];
            data.forEach(item => {
              if (typeof item.id === 'string' && typeof item.name === 'string') {
                typesArray.push({
                  id: item.id,
                  name: item.name
                });
              }
            });
            setTypes(typesArray);
          }
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
        
        // Add a null check before setting state
        if (error) {
          console.error('Error fetching sectors:', error);
          setSectors([]);
          return;
        }
        
        if (data) {
          // Transform with type safety
          const sectorsArray: {id: string; name: string}[] = [];
          data.forEach(item => {
            if (typeof item.id === 'string' && typeof item.name === 'string') {
              sectorsArray.push({
                id: item.id,
                name: item.name
              });
            }
          });
          setSectors(sectorsArray);
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
