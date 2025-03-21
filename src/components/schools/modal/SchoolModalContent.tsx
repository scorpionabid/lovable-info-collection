
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School } from '@/lib/supabase/types';
import SchoolForm from './SchoolForm';

interface SchoolModalContentProps {
  mode: 'create' | 'edit' | 'view';
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: School;
  regionId?: string;
}

const SchoolModalContent: React.FC<SchoolModalContentProps> = ({
  mode,
  onClose,
  onSuccess,
  initialData,
  regionId = '',
}) => {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="general">General Information</TabsTrigger>
        {mode !== 'create' && <TabsTrigger value="admin">Admin</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="general">
        <SchoolForm 
          school={initialData} 
          onClose={onClose} 
          onSuccess={onSuccess}
          regionId={regionId}
          mode={mode}
        />
      </TabsContent>
      
      <TabsContent value="admin">
        {mode !== 'create' && (
          <div className="p-4 bg-gray-50 rounded-md">
            <p>Admin management functionality will be implemented here.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default SchoolModalContent;
