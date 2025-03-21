
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SchoolModalContent } from './SchoolModalContent';
import { SchoolForm } from './SchoolForm';

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  school?: any;
  mode?: 'create' | 'edit';
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  school,
  mode = 'create'
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <Tabs defaultValue="general">
          <TabsContent value="general" className="mt-0">
            <SchoolModalContent
              mode={mode}
              school={school}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
