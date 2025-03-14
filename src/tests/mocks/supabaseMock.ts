import { Database } from '@/integrations/supabase/types';

// Mock data store for our mock Supabase instance
interface MockDataStore {
  [table: string]: any[];
}

const mockData: MockDataStore = {
  users: [],
  regions: [],
  sectors: [],
  schools: [],
  categories: [],
  roles: [
    { id: 'role-1', name: 'super-admin', description: 'Super Admin', permissions: ['all'] },
    { id: 'role-2', name: 'region-admin', description: 'Region Admin', permissions: ['region:read', 'region:write'] },
    { id: 'role-3', name: 'sector-admin', description: 'Sector Admin', permissions: ['sector:read', 'sector:write'] },
    { id: 'role-4', name: 'school-admin', description: 'School Admin', permissions: ['school:read', 'school:write'] }
  ]
};

// Create proper mock functions for auth
const mockAuthFunctions = {
  signInWithPassword: jest.fn(() => Promise.resolve({ 
    data: { user: { id: 'mock-user-id' }, session: { access_token: 'mock-token' } }, 
    error: null 
  })),
  signUp: jest.fn(() => Promise.resolve({ 
    data: { user: { id: 'mock-user-id' } }, 
    error: null 
  })),
  signOut: jest.fn(() => Promise.resolve({ error: null })),
  resetPasswordForEmail: jest.fn(() => Promise.resolve({ error: null })),
  updateUser: jest.fn(() => Promise.resolve({ 
    data: { user: { id: 'mock-user-id' } }, 
    error: null 
  })),
  getUser: jest.fn(() => Promise.resolve({ 
    data: { user: { id: 'mock-user-id' } }, 
    error: null 
  })),
  // Mock admin methods
  admin: {
    listUsers: jest.fn(() => Promise.resolve({ 
      data: { users: [] }, 
      error: null 
    }))
  }
};

// Helper functions for resetting and seeding mock data
const resetMockData = () => {
  for (const table in mockData) {
    if (table === 'roles') {
      // Keep the default roles
      continue;
    }
    mockData[table] = [];
  }
};

const seedMockData = (table: string, data: any[]) => {
  mockData[table] = [...data];
};

// Helper to mock Supabase
export const mockSupabase = () => {
  return createMockSupabaseClient();
};

// Export the reset and seed functions separately for easier testing
export { resetMockData, seedMockData };

// Supabase client mock
const createMockSupabaseClient = () => {
  const mockClient = {
    from: jest.fn((table: string) => {
      return {
        select: jest.fn((columns: string = '*') => {
          return {
            eq: jest.fn((column: string, value: any) => {
              const filteredData = mockData[table]?.filter(item => item[column] === value) || [];
              return {
                single: jest.fn(() => Promise.resolve({ 
                  data: filteredData.length > 0 ? filteredData[0] : null, 
                  error: null 
                })),
                data: filteredData,
                error: null
              };
            }),
            order: jest.fn(() => ({
              data: mockData[table] || [],
              error: null
            })),
            range: jest.fn(() => ({
              data: mockData[table] || [],
              error: null,
              count: mockData[table]?.length || 0
            })),
            data: mockData[table] || [],
            error: null
          };
        }),
        insert: jest.fn((data: any) => {
          // Handle both array and non-array data
          const dataArray = Array.isArray(data) ? data : [data];
          const newItems = dataArray.map(item => ({
            id: `mock-id-${Math.random().toString(36).substring(2, 9)}`,
            ...item
          }));
          
          if (!mockData[table]) {
            mockData[table] = [];
          }
          
          mockData[table].push(...newItems);
          
          return {
            select: jest.fn(() => Promise.resolve({ 
              data: newItems, 
              error: null 
            })),
            data: newItems,
            error: null
          };
        }),
        update: jest.fn((data: any) => {
          return {
            eq: jest.fn((column: string, value: any) => {
              const index = mockData[table]?.findIndex(item => item[column] === value) || -1;
              if (index !== -1 && mockData[table]) {
                mockData[table][index] = { ...mockData[table][index], ...data };
                return {
                  select: jest.fn(() => Promise.resolve({ 
                    data: [mockData[table][index]], 
                    error: null 
                  })),
                  data: [mockData[table][index]],
                  error: null
                };
              }
              return {
                select: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Item not found' } })),
                data: null,
                error: { message: 'Item not found' }
              };
            })
          };
        }),
        delete: jest.fn(() => {
          return {
            eq: jest.fn((column: string, value: any) => {
              const initialLength = mockData[table]?.length || 0;
              if (mockData[table]) {
                mockData[table] = mockData[table].filter(item => item[column] !== value);
              }
              const deleted = initialLength - (mockData[table]?.length || 0);
              return Promise.resolve({ 
                data: { deleted }, 
                error: null 
              });
            })
          };
        })
      };
    }),
    auth: mockAuthFunctions
  };

  // Add helper methods for testing
  return {
    ...mockClient,
    _reset: resetMockData,
    _seed: seedMockData
  };
};
