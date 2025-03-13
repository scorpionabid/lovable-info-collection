
import { User } from "@/services/supabase/user/types";

export const getEntityName = (user: User) => {
  if (user.school_id) return "Məktəb";
  if (user.sector_id) return "Sektor";
  if (user.region_id) return "Region";
  if (user.roles?.name === "super-admin" || user.roles?.name === "superadmin" || 
      user.role === "super-admin" || user.role === "superadmin") {
    return "Bütün sistem";
  }
  return "Təyin edilməyib";
};
