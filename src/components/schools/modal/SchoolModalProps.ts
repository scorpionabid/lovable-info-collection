
import { School } from "@/lib/supabase/types";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  initialData?: School;
  onSuccess?: () => void;
  onCreated?: () => void;
  onSchoolCreated?: (data: School) => void;
  onSchoolUpdated?: (data: School) => void;
  school?: School;
}
