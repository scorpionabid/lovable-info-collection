
import { School } from "@/lib/supabase/types";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  initialData?: School; // Dəyişməyən prop
  onSuccess?: () => void; // Dəyişməyən prop
  onCreated?: () => void; // Əlavə edilmiş prop
  onSchoolCreated?: (data: School) => void; // Əlavə edilmiş prop
  onSchoolUpdated?: (data: School) => void; // Əlavə edilmiş prop
  school?: School; // Əlavə edilmiş prop
}
