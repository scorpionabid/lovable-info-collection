
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0
    },
  }
});

export function renderWithQueryClient(
  ui: React.ReactElement,
  client?: QueryClient
) {
  const queryClient = client ?? createTestQueryClient();
  
  return {
    ...render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    ),
    queryClient,
  };
}

export async function waitForQueryToSettle() {
  // Wait for React Query's default stale time
  await new Promise(resolve => setTimeout(resolve, 10));
}
