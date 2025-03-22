
import { School } from "@/lib/supabase/types/school";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "create" | "edit";
  initialData?: School;
  onSuccess?: () => void;
  regionId?: string;
  school?: School;
  onCreated?: () => void;
  onSchoolCreated?: () => void;
  onSchoolUpdated?: () => void;
}
