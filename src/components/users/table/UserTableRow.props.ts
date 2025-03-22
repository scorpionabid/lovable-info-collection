
import { User } from "@/lib/supabase/types";

export interface UserTableRowProps {
  key: string;
  user: User;
  isSelected: boolean;
  onSelect: (userId: string, checked: boolean) => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}
