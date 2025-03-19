import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext'; // Import düzgün olmalıdır
import React from 'react'; // React-i import edin

describe('AuthContext', () => {
  it('should provide auth context', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    expect(result.current).toBeDefined();
  });
});