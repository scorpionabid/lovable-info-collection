
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { School } from '@/lib/supabase/types/school';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SchoolForm from './SchoolForm';

export interface SchoolModalContentProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: School | null;
  sectorId?: string;
  regionId?: string;
}

const SchoolModalContent: React.FC<SchoolModalContentProps> = ({ 
  isOpen,
  onClose,
  onSave,
  mode = 'create',
  initialData,
  sectorId,
  regionId
}) => {
  const [activeTab, setActiveTab] = React.useState<string>('basic');

  // Reset active tab when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab('basic');
    }
  }, [isOpen]);

  // Determine title based on mode
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Yeni Məktəb';
      case 'edit':
        return 'Məktəb Redaktəsi';
      case 'view':
        return 'Məktəb Məlumatları';
      default:
        return 'Məktəb';
    }
  };

  // Determine if form should be read-only
  const isReadOnly = mode === 'view';

  // Only allow edit, create modes
  const formMode = mode === 'view' ? 'edit' : mode;

  return (
    <div className="space-y-6 py-4 px-6">
      <h2 className="text-xl font-semibold">{getTitle()}</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Əsas Məlumatlar</TabsTrigger>
          <TabsTrigger value="contact">Əlaqə</TabsTrigger>
          <TabsTrigger value="additional">Əlavə</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <SchoolForm 
            mode={formMode} 
            initialData={initialData}
            isReadOnly={isReadOnly}
            onSave={onSave}
            sectorId={sectorId}
            regionId={regionId}
          />
        </TabsContent>

        <TabsContent value="contact">
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <p className="text-gray-500">Bu funksionallıq hazırda inkişaf mərhələsindədir.</p>
          </div>
        </TabsContent>

        <TabsContent value="additional">
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <p className="text-gray-500">Bu funksionallıq hazırda inkişaf mərhələsindədir.</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Bağla
        </Button>
        {!isReadOnly && (
          <Button type="submit" form="school-form">
            {mode === 'create' ? 'Yarat' : 'Yadda saxla'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SchoolModalContent;
