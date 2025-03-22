
// Re-export all services for easier imports
export * from './categoryService';
export * from './regionService';
export * from './schoolService';
export * from './sectorService';

// Create a service for accessing school types
export const createSchool = async (data: any) => {
  const { createSchool } = await import('./schoolService');
  return createSchool(data);
};

export const updateSchool = async (id: string, data: any) => {
  const { updateSchool } = await import('./schoolService');
  return updateSchool(id, data);
};

export const createUser = async (data: any) => {
  const { createUser } = await import('@/lib/supabase/services/users');
  return createUser(data);
};

export const updateUser = async (id: string, data: any) => {
  const { updateUser } = await import('@/lib/supabase/services/users');
  return updateUser(id, data);
};

export const deleteUser = async (id: string) => {
  const { deleteUser } = await import('@/lib/supabase/services/users');
  return deleteUser(id);
};

export const resetUserPassword = async (id: string) => {
  const { resetPassword } = await import('@/lib/supabase/services/users');
  return resetPassword(id);
};
