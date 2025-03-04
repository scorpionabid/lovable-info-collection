
import { UserRole } from '@/contexts/AuthContext';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id?: string;
  role?: UserRole;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active?: boolean;
  last_login?: string;
  roles?: {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
  };
}

export interface UserFilters {
  role?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: 'active' | 'inactive' | 'blocked';
  search?: string;
}
