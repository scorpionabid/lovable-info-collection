
/**
 * İstifadəçi əməliyyatları üçün DTO tiplər
 */

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active?: boolean;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active?: boolean;
  avatar_url?: string;
}
