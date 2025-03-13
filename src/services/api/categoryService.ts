
import api from './index';

const CATEGORIES_ENDPOINT = 'categories';
const COLUMNS_ENDPOINT = 'columns';

// Category CRUD operations
export const getCategories = async (filters = {}) => {
  return api.fetchItems(CATEGORIES_ENDPOINT, 1, 100, filters);
};

export const getCategoryById = async (id) => {
  return api.getItemById(CATEGORIES_ENDPOINT, id);
};

export const createCategory = async (category) => {
  return api.createItem(CATEGORIES_ENDPOINT, category);
};

export const updateCategory = async (id, category) => {
  return api.updateItem(CATEGORIES_ENDPOINT, id, category);
};

export const deleteCategory = async (id) => {
  return api.deleteItem(CATEGORIES_ENDPOINT, id);
};

// Column CRUD operations
export const getCategoryColumns = async (categoryId) => {
  return api.fetchItems(COLUMNS_ENDPOINT, 1, 100, { category_id: categoryId });
};

export const getColumnById = async (id) => {
  return api.getItemById(COLUMNS_ENDPOINT, id);
};

export const createColumn = async (categoryId, column) => {
  const result = await api.createItem(COLUMNS_ENDPOINT, { ...column, category_id: categoryId });
  return { success: result.success, data: result.data, error: result.error };
};

export const updateColumn = async (id, column) => {
  const result = await api.updateItem(COLUMNS_ENDPOINT, id, column);
  return { success: result.success, data: result.data, error: result.error };
};

export const deleteColumn = async (id) => {
  return api.deleteItem(COLUMNS_ENDPOINT, id);
};

// Category utilities
export const getCategoryCompletionRate = async (categoryId) => {
  // Mock implementation - this would be a real calculation in production
  return Math.floor(Math.random() * 100);
};

export const exportCategoryTemplate = async (categoryId) => {
  // Mock implementation
  return new Blob(['Sample template data'], { type: 'text/plain' });
};
