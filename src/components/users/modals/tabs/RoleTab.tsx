
import React, { useEffect, useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User } from '@/supabase/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';

interface RoleTabProps {
  formData: {
    role_id: string;
    region_id: string;
    sector_id: string;
    school_id: string;
  };
  handleSelectChange: (name: string, value: any) => void;
  errors: Record<string, string>;
  isViewMode: boolean;
  currentUserRole?: string;
}

export const RoleTab: React.FC<RoleTabProps> = ({
  formData,
  handleSelectChange,
  errors,
  isViewMode,
  currentUserRole
}) => {
  // Fetch roles
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch regions
  const { data: regions = [] } = useQuery({
    queryKey: ['regions_dropdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch sectors based on selected region
  const { data: sectors = [] } = useQuery({
    queryKey: ['sectors_dropdown', formData.region_id],
    queryFn: async () => {
      if (!formData.region_id) return [];
      
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name')
        .eq('region_id', formData.region_id)
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!formData.region_id
  });

  // Fetch schools based on selected sector
  const { data: schools = [] } = useQuery({
    queryKey: ['schools_dropdown', formData.sector_id],
    queryFn: async () => {
      if (!formData.sector_id) return [];
      
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .eq('sector_id', formData.sector_id)
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!formData.sector_id
  });

  // Get the selected role object
  const selectedRole = roles.find(role => role.id === formData.role_id);
  const roleType = selectedRole?.name?.toLowerCase() || '';

  // Determine which fields to show based on role
  const showRegionField = roleType.includes('region') || roleType.includes('sector') || roleType.includes('school');
  const showSectorField = roleType.includes('sector') || roleType.includes('school');
  const showSchoolField = roleType.includes('school');

  // Handle clearing fields when role changes
  useEffect(() => {
    if (!showRegionField) {
      handleSelectChange('region_id', '');
    }
    if (!showSectorField) {
      handleSelectChange('sector_id', '');
    }
    if (!showSchoolField) {
      handleSelectChange('school_id', '');
    }
  }, [roleType, showRegionField, showSectorField, showSchoolField]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">Rol</Label>
        <Select
          disabled={isViewMode}
          value={formData.role_id}
          onValueChange={(value) => handleSelectChange('role_id', value)}
        >
          <SelectTrigger id="role" className={errors.role_id ? 'border-red-500' : ''}>
            <SelectValue placeholder="Rol seçin" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role_id && (
          <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>
        )}
      </div>
      
      {showRegionField && (
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select
            disabled={isViewMode || (currentUserRole === 'region-admin')}
            value={formData.region_id}
            onValueChange={(value) => handleSelectChange('region_id', value)}
          >
            <SelectTrigger id="region" className={errors.region_id ? 'border-red-500' : ''}>
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
          {errors.region_id && (
            <p className="text-red-500 text-sm mt-1">{errors.region_id}</p>
          )}
        </div>
      )}
      
      {showSectorField && formData.region_id && (
        <div className="space-y-2">
          <Label htmlFor="sector">Sektor</Label>
          <Select
            disabled={isViewMode || (currentUserRole === 'sector-admin')}
            value={formData.sector_id}
            onValueChange={(value) => handleSelectChange('sector_id', value)}
          >
            <SelectTrigger id="sector" className={errors.sector_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Sektor seçin" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sector_id && (
            <p className="text-red-500 text-sm mt-1">{errors.sector_id}</p>
          )}
        </div>
      )}
      
      {showSchoolField && formData.sector_id && (
        <div className="space-y-2">
          <Label htmlFor="school">Məktəb</Label>
          <Select
            disabled={isViewMode}
            value={formData.school_id}
            onValueChange={(value) => handleSelectChange('school_id', value)}
          >
            <SelectTrigger id="school" className={errors.school_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Məktəb seçin" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.school_id && (
            <p className="text-red-500 text-sm mt-1">{errors.school_id}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleTab;
