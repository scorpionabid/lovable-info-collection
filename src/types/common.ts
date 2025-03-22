
// Updated UserRole to include more values including 'super-admin' and typescript string enums
export type UserRole = 'super-admin' | 'region-admin' | 'sector-admin' | 'school-admin' | 'teacher';

// Role interface for compatibility with other files
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[] | Record<string, any>;
}
