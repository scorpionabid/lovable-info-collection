
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { X } from 'lucide-react';

interface UserFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onApplyFilters: (filters: any) => void;
}

export const UserFilterPanel: React.FC<UserFilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!isOpen) return null;

  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({
      role_id: '',
      region_id: '',
      sector_id: '',
      school_id: '',
      status: 'active'
    });
  };

  return (
    <Card className="p-4 shadow-md mb-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filtrlər</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Rol</label>
          <select
            className="w-full p-2 border rounded"
            value={localFilters.role_id || ''}
            onChange={(e) => handleFilterChange('role_id', e.target.value)}
          >
            <option value="">Bütün rollar</option>
            <option value="super_admin">Super Admin</option>
            <option value="region_admin">Region Admin</option>
            <option value="sector_admin">Sektor Admin</option>
            <option value="school_admin">Məktəb Admin</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Region</label>
          <select
            className="w-full p-2 border rounded"
            value={localFilters.region_id || ''}
            onChange={(e) => handleFilterChange('region_id', e.target.value)}
          >
            <option value="">Bütün regionlar</option>
            <option value="region1">Region 1</option>
            <option value="region2">Region 2</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            className="w-full p-2 border rounded"
            value={localFilters.status || 'active'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Hamısı</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Deaktiv</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleReset}>Sıfırla</Button>
        <Button onClick={handleApply}>Tətbiq et</Button>
      </div>
    </Card>
  );
};
