
import { mockSupabase } from '../mocks/supabaseMock';
import * as categoryService from '@/services/supabase/category';

// Get a typed mock instance
const mockedSupabase = mockSupabase();

// Apply the mock before running tests
jest.mock('@/services/supabase/supabaseClient', () => {
  return {
    supabase: mockedSupabase
  };
});

describe('categoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock data
    mockedSupabase._reset();
  });

  describe('getCategories', () => {
    it('should fetch categories successfully', async () => {
      // Seed mock data
      const mockCategories = [
        { id: 'cat-1', name: 'Category 1', priority: 1, status: 'Active' },
        { id: 'cat-2', name: 'Category 2', priority: 2, status: 'Active' }
      ];
      
      mockedSupabase._seed('categories', mockCategories);
      
      // Test the service function
      const result = await categoryService.getCategories();
      
      expect(result).toBeTruthy();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Category 1');
    });

    it('should handle errors when fetching categories', async () => {
      // Mock an error
      const originalFrom = mockedSupabase.from;
      mockedSupabase.from = jest.fn().mockImplementationOnce(() => {
        return {
          select: jest.fn().mockImplementationOnce(() => {
            throw new Error('Database error');
          })
        };
      });
      
      await expect(categoryService.getCategories()).rejects.toThrow('Database error');
      
      // Restore original mock
      mockedSupabase.from = originalFrom;
    });
  });

  describe('getCategoryById', () => {
    it('should fetch a category by ID', async () => {
      // Seed mock data
      const mockCategory = { id: 'cat-1', name: 'Category 1', priority: 1, status: 'Active' };
      mockedSupabase._seed('categories', [mockCategory]);
      
      // Test the service function
      const result = await categoryService.getCategoryById('cat-1');
      
      expect(result).toBeTruthy();
      expect(result.id).toBe('cat-1');
      expect(result.name).toBe('Category 1');
    });

    it('should handle not finding a category', async () => {
      // Test with empty data
      mockedSupabase._reset();
      
      await expect(categoryService.getCategoryById('non-existent')).rejects.toThrow();
    });
  });
});
