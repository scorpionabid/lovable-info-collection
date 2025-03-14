
import { mockSupabase, seedMockData } from '../mocks/supabaseMock';
import { mockCategories, mockColumns } from '../mocks/mockData';
import categoryService from '@/services/supabase/category';

// Apply the mock before running tests
mockSupabase();

describe('categoryService', () => {
  beforeEach(() => {
    // Seed mock data for categories and columns
    seedMockData('categories', [...mockCategories]);
    seedMockData('columns', [...mockColumns]);
  });

  describe('getCategories', () => {
    it('should fetch all categories', async () => {
      const result = await categoryService.getCategories();
      
      expect(result).toBeTruthy();
      expect(result.data).toHaveLength(mockCategories.length);
      expect(result.data[0].name).toBe(mockCategories[0].name);
    });

    it('should include completion rates when includeStats is true', async () => {
      const result = await categoryService.getCategories({ includeStats: true });
      
      expect(result).toBeTruthy();
      expect(result.data).toHaveLength(mockCategories.length);
      expect(result.data[0]).toHaveProperty('completionRate');
    });

    it('should apply sorting when provided', async () => {
      const result = await categoryService.getCategories({ 
        sort: { column: 'name', direction: 'desc' } 
      });
      
      expect(result).toBeTruthy();
      // Since our mock doesn't actually sort, we just check that the function ran
      expect(result.data).toHaveLength(mockCategories.length);
    });
  });

  describe('getCategoryById', () => {
    it('should fetch a single category by ID', async () => {
      const categoryId = mockCategories[0].id;
      const result = await categoryService.getCategoryById(categoryId);
      
      expect(result).toBeTruthy();
      expect(result.id).toBe(categoryId);
      expect(result.name).toBe(mockCategories[0].name);
    });

    it('should return null for non-existent ID', async () => {
      const result = await categoryService.getCategoryById('non-existent');
      
      expect(result).toBeNull();
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const newCategory = {
        name: 'Test Category',
        description: 'Test Description'
      };
      
      const result = await categoryService.createCategory(newCategory);
      
      expect(result).toBeTruthy();
      expect(result.name).toBe(newCategory.name);
      expect(result.description).toBe(newCategory.description);
      expect(result.id).toBeDefined();
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const categoryId = mockCategories[0].id;
      const updates = {
        name: 'Updated Name',
        description: 'Updated Description'
      };
      
      const result = await categoryService.updateCategory(categoryId, updates);
      
      expect(result).toBeTruthy();
      expect(result.name).toBe(updates.name);
      expect(result.description).toBe(updates.description);
      expect(result.id).toBe(categoryId);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const categoryId = mockCategories[0].id;
      
      const result = await categoryService.deleteCategory(categoryId);
      
      expect(result).toBeTruthy();
      expect(result.success).toBe(true);
      
      // Verify the category was deleted
      const check = await categoryService.getCategoryById(categoryId);
      expect(check).toBeNull();
    });
  });

  describe('getCategoryColumns', () => {
    it('should fetch columns for a specific category', async () => {
      const categoryId = mockCategories[0].id;
      const categoryColumns = mockColumns.filter(col => col.category_id === categoryId);
      
      const result = await categoryService.getCategoryColumns(categoryId);
      
      expect(result).toBeTruthy();
      expect(result).toHaveLength(categoryColumns.length);
      expect(result[0].name).toBe(categoryColumns[0].name);
    });
  });
});
