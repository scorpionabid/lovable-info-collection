import { describe, it, expect } from 'vitest';
import { validateData } from '@/utils/dataValidation';

describe('Data Validation Test Suite', () => {
  it('should validate data correctly', () => {
    const data = { name: 'Test', age: 25 };
    const result = validateData(data);
    expect(result).toBe(true);
  });
});