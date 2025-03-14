
import { mockSupabase } from '../mocks/supabaseMock';
import * as categoryService from '@/services/supabase/category';

// Apply the mock before running tests
jest.mock('@/services/supabase/supabaseClient', () => {
  return {
    supabase: mockSupabase()
  };
});

describe('categoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock data
    mockSupabase._reset();
  });

  describe('getCategories', () => {
    it('should fetch categories successfully', async () => {
      // Seed mock data
      const mockCategories = [
        { id: 'cat-1', name: 'Category 1', priority: 1, status: 'Active' },
        { id: 'cat-2', name: 'Category 2', priority: 2, status: 'Active' }
      ];
      
      mockSupabase._seed('categories', mockCategories);
      
      // Test the service function
      const result = await categoryService.getCategories();
      
      expect(result).toBeTruthy();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Category 1');
    });

    it('should handle errors when fetching categories', async () => {
      // Mock an error
      jest.spyOn(mockSupabase.from('categories'), 'select').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      
      await expect(categoryService.getCategories()).rejects.toThrow('Database error');
    });
  });

  describe('getCategoryById', () => {
    it('should fetch a category by ID', async () => {
      // Seed mock data
      const mockCategory = { id: 'cat-1', name: 'Category 1', priority: 1, status: 'Active' };
      mockSupabase._seed('categories', [mockCategory]);
      
      // Test the service function
      const result = await categoryService.getCategoryById('cat-1');
      
      expect(result).toBeTruthy();
      expect(result.id).toBe('cat-1');
      expect(result.name).toBe('Category 1');
    });

    it('should handle not finding a category', async () => {
      // Test with empty data
      mockSupabase._reset();
      
      await expect(categoryService.getCategoryById('non-existent')).rejects.toThrow();
    });
  });
});
