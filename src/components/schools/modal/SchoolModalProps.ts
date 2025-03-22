
import { School } from "@/lib/supabase/types/school";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  school?: School;
  initialData?: any;
  onSuccess?: () => void;
  onSchoolCreated?: () => void;
  onSchoolUpdated?: () => void;
  onCreated?: () => void;
  regionId?: string;
}
