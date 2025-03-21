
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminTabProps {
  formData: {
    adminId: string;
  };
  handleSelectChange: (name: string, value: string) => void;
}

export const AdminTab: React.FC<AdminTabProps> = ({ formData, handleSelectChange }) => {
  const [admins, setAdmins] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load available admins
  useEffect(() => {
    const loadAdmins = async () => {
      setIsLoading(true);
      try {
        // Mocked data for now
        // In a real implementation, this would fetch from the API
        const mockAdmins = [
          { id: '1', name: 'Admin 1' },
          { id: '2', name: 'Admin 2' },
          { id: '3', name: 'Admin 3' },
        ];
        
        setAdmins(mockAdmins);
      } catch (error) {
        console.error('Error loading admins:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAdmins();
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="adminId">Region admini</Label>
        <Select 
          value={formData.adminId} 
          onValueChange={(value) => handleSelectChange('adminId', value)}
        >
          <SelectTrigger id="adminId">
            <SelectValue placeholder={isLoading ? "Yüklənir..." : "Region adminini seçin"} />
          </SelectTrigger>
          <SelectContent>
            {admins.map((admin) => (
              <SelectItem key={admin.id} value={admin.id}>
                {admin.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-infoline-dark-gray">
          Bu regionun administratorunu seçin. Region administratoru regiondakı sektorları və məktəbləri idarə edə bilər.
        </p>
      </div>
    </div>
  );
};
