
import api from './index';

export interface CategoryData {
  id?: string;
  name: string;
  description?: string;
  order?: number;
  deadline?: string;
  status?: string;
}

export interface ColumnData {
  id?: string;
  name: string;
  description?: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'file';
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    regex?: string;
    message?: string;
  };
  order?: number;
}

const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  createCategory: async (categoryData: CategoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  
  getCategory: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  
  updateCategory: async (id: string, categoryData: Partial<CategoryData>) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
  
  getCategoryColumns: async (categoryId: string) => {
    const response = await api.get(`/categories/${categoryId}/columns`);
    return response.data;
  },
  
  addCategoryColumn: async (categoryId: string, columnData: ColumnData) => {
    const response = await api.post(`/categories/${categoryId}/columns`, columnData);
    return response.data;
  },
  
  getColumn: async (id: string) => {
    const response = await api.get(`/columns/${id}`);
    return response.data;
  },
  
  updateColumn: async (id: string, columnData: Partial<ColumnData>) => {
    const response = await api.put(`/columns/${id}`, columnData);
    return response.data;
  },
  
  deleteColumn: async (id: string) => {
    const response = await api.delete(`/columns/${id}`);
    return response.data;
  }
};

export default categoryService;
