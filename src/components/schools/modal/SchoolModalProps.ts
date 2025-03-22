
import { School } from "@/lib/supabase/types";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  initialData?: School; // Bu xəta verən prop
  onSuccess?: () => void; // Bu xəta verən prop
}
