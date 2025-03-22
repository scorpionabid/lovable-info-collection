
import { SchoolModalProps } from './modal/SchoolModalProps';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SchoolForm from './modal/SchoolForm';
import { School } from '@/lib/supabase/types/school';

interface SchoolModalComponentProps extends SchoolModalProps {
  // Component spesifik əlavə proplar
}

export const SchoolModal = ({ 
  isOpen, 
  onClose, 
  mode = 'create', 
  initialData,
  onSuccess,
  regionId,
  onCreated,
  onSchoolCreated,
  onSchoolUpdated,
  school
}: SchoolModalComponentProps) => {
  const handleSubmit = (data: any) => {
    // Form təqdim edildikdə
    console.log('Form submitted:', data);
    
    // Əgər təqdim uğurludursa, müvafiq callback funksiyasını çağırın
    if (mode === 'create') {
      if (onCreated) onCreated();
      if (onSchoolCreated) onSchoolCreated();
    } else if (mode === 'edit') {
      if (onSchoolUpdated) onSchoolUpdated();
      if (onSuccess) onSuccess();
    } else if (onSuccess) {
      onSuccess();
    }
    
    // Modal-ı bağla
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Yeni məktəb yarat';
      case 'edit':
        return 'Məktəbi redaktə et';
      case 'view':
        return 'Məktəb məlumatları';
      default:
        return 'Məktəb';
    }
  };

  // İlkin məlumatları təyin et - ya initialData ya da school propundan istifadə et
  const schoolData = initialData || school;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <SchoolForm
          initialData={schoolData as School}
          regionId={regionId}
          onSubmit={handleSubmit}
          isLoading={false}
          disabled={mode === 'view'}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SchoolModal;
