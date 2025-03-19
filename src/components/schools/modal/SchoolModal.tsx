
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { School } from "@/services/supabase/school/types";
import { useSchoolForm } from "./useSchoolForm";
import { SchoolForm } from "./SchoolForm";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: School;
  onSuccess?: () => void;
  regionId?: string;
  onCreated?: () => void; // Added for compatibility with RegionDetails.tsx
}

export const SchoolModal = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSuccess,
  regionId,
  onCreated
}: SchoolModalProps) => {
  const {
    form,
    isSubmitting,
    errorMessage,
    handleSubmit
  } = useSchoolForm({
    mode,
    initialData,
    onSuccess: () => {
      // Call both callbacks if available
      if (onSuccess) onSuccess();
      if (onCreated) onCreated();
    },
    regionId
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Yeni məktəb əlavə et" : "Məktəb məlumatlarını redaktə et"}
          </DialogTitle>
        </DialogHeader>
        <SchoolForm
          form={form}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};
