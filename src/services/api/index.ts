
import { enhancedApi } from './core/enhancedApi';
import { 
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem 
} from './core/crudOperations';

// Re-export the core CRUD operations
export {
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};

// Export the enhanced API interface as both named and default export
export const api = enhancedApi;
export default api;
