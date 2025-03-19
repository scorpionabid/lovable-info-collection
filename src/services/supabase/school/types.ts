
// School interface to match the database schema
export interface School {
  id: string;
  name: string;
  code: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  address: string;
  created_at: string;
  updated_at: string;
  student_count?: number;
  teacher_count?: number;
  status?: string;
  director?: string;
  email?: string;
  phone?: string;
  archived?: boolean;
  // Add other optional fields that might be used
  regions?: any;
  sectors?: any;
  school_types?: any;
  activities?: any[];
  completionRate?: number;
  adminName?: string;
  adminId?: string;
}

// Add other interfaces as needed
export interface SchoolActivity {
  id: string;
  action: string;
  user_id: string;
  performed_at: string;
  details?: string;
  metadata?: any;
}
