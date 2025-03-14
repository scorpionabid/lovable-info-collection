
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialEntries?: string[];
  queryClient?: QueryClient;
}

// Mocked user roles for testing
export const mockUsers = {
  superAdmin: {
    id: 'super-admin-id',
    email: 'superadmin@infoline.az',
    first_name: 'Super',
    last_name: 'Admin',
    role: 'super_admin',
    is_active: true
  },
  regionAdmin: {
    id: 'region-admin-id',
    email: 'regionadmin@infoline.az',
    first_name: 'Region',
    last_name: 'Admin',
    role: 'region_admin',
    region_id: 'region-1',
    is_active: true
  },
  sectorAdmin: {
    id: 'sector-admin-id',
    email: 'sectoradmin@infoline.az',
    first_name: 'Sector',
    last_name: 'Admin',
    role: 'sector_admin',
    sector_id: 'sector-1',
    is_active: true
  },
  schoolAdmin: {
    id: 'school-admin-id',
    email: 'schooladmin@infoline.az',
    first_name: 'School',
    last_name: 'Admin',
    role: 'school_admin',
    school_id: 'school-1',
    is_active: true
  }
};

export function customRender(
  ui: ReactElement,
  {
    route = '/',
    initialEntries = [route],
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  };
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };
