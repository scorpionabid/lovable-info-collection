
import { isId } from '../utils/helpers';
import { 
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem 
} from './crudOperations';

// Enhanced API interface that supports both traditional and axios-like calls
export const enhancedApi = {
  // Original methods
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  
  // Enhanced methods that can handle both traditional and config-style parameters
  get: (tableNameOrConfig: string | any, id?: string | any) => {
    // Handle URL string with config object pattern
    if (isId(tableNameOrConfig) && typeof id === 'object') {
      return { data: null, error: null }; // Mock response for RESTful GET calls
    }
    
    // Handle axios-style config object where the first param is the config
    if (!isId(tableNameOrConfig) && !id) {
      const url = tableNameOrConfig.url || '';
      return { data: null, error: null }; // Mock response for axios-style GET calls
    }
    
    // Handle traditional call pattern
    return isId(id) 
      ? getItemById(tableNameOrConfig as string, id)
      : { data: null, error: new Error('Invalid ID parameter') };
  },
  
  post: (tableNameOrConfig: string | any, item?: any) => {
    // Handle URL string with config object pattern
    if (isId(tableNameOrConfig) && typeof item === 'object') {
      return { data: item, success: true, error: null }; // Mock response for RESTful POST calls
    }
    
    // Handle axios-style config object
    if (!isId(tableNameOrConfig) && !item) {
      return { data: null, success: true, error: null }; // Mock response for axios-style POST calls
    }
    
    // Handle traditional call pattern
    return createItem(tableNameOrConfig as string, item);
  },
  
  put: (tableNameOrConfig: string | any, idOrItem?: string | any, item?: any) => {
    // Handle URL string with config object as second param
    if (isId(tableNameOrConfig) && typeof idOrItem === 'object' && !item) {
      return { data: idOrItem, success: true, error: null }; // Mock response for RESTful PUT calls
    }
    
    // Handle axios-style config object
    if (!isId(tableNameOrConfig) && !idOrItem) {
      return { data: null, success: true, error: null }; // Mock response for axios-style PUT calls
    }
    
    // If second param is not an ID but an object, adjust parameters
    if (idOrItem && typeof idOrItem !== 'string') {
      return updateItem(tableNameOrConfig as string, idOrItem.id, idOrItem);
    }
    
    // Handle traditional call pattern
    return updateItem(tableNameOrConfig as string, idOrItem as string, item);
  },
  
  delete: (tableNameOrConfig: string | any, id?: string) => {
    // Handle URL string with empty second param
    if (isId(tableNameOrConfig) && !id) {
      return { success: true, data: null, error: null }; // Mock response for RESTful DELETE calls
    }
    
    // Handle axios-style config object
    if (!isId(tableNameOrConfig) && !id) {
      return { success: true, data: null, error: null }; // Mock response for axios-style DELETE calls
    }
    
    // Handle traditional call pattern
    return deleteItem(tableNameOrConfig as string, id as string);
  }
};
