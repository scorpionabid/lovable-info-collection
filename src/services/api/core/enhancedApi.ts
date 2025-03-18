
import { isId } from '../utils/helpers';
import { 
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem 
} from './crudOperations';
import { getSectors, getSectorById } from '@/services/supabase/sector/querySectors';
import { logger } from '@/utils/logger';
import { measurePerformance } from '@/utils/performanceMonitor';

// Enhanced API interface that supports both traditional and axios-like calls
export const enhancedApi = {
  // Original methods
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  
  // Enhanced methods that can handle both traditional and config-style parameters
  get: async (tableNameOrConfig: string | any, id?: string | any) => {
    // Performans monitorinqi ilə bütün API sorğularını əhatə edirik
    return measurePerformance('api.get', async () => {
      // Handle URL string with config object pattern for RESTful API calls
      if (typeof tableNameOrConfig === 'string' && tableNameOrConfig.startsWith('/')) {
        const url = tableNameOrConfig;
        const params = id && typeof id === 'object' ? id.params : {};
        
        logger.info('API GET request', { url, params });
        
        // Route to appropriate Supabase query based on endpoint
        if (url === '/sectors') {
          try {
            // getSectors artıq özü performans monitorinqi ilə əhatə olunub
            const result = await getSectors(
              { 
                page: params?.page || 1, 
                pageSize: params?.limit || 10 
              },
              { 
                column: params?.sortColumn || 'name', 
                direction: params?.sortDirection || 'asc' 
              },
              { 
                searchQuery: params?.search || '',
                regionId: params?.regionId || '',
                dateFrom: params?.dateFrom || '',
                dateTo: params?.dateTo || '',
                completionRate: params?.completionRate || 'all'
              }
            );
            
            return { data: result, error: null };
          } catch (error) {
            logger.error('Error fetching sectors data', error);
            return { data: null, error };
          }
        }
        
        // Specific sector by ID
        if (url.startsWith('/sectors/') && url.length > 9) {
          try {
            const sectorId = url.substring(9);
            const result = await getSectorById(sectorId);
            return { data: result, error: null };
          } catch (error) {
            logger.error(`Error fetching sector with ID ${url.substring(9)}`, error);
            return { data: null, error };
          }
        }
      
        // For other endpoints, log warning and return empty result
        logger.warn(`Unhandled API endpoint: ${url}`);
        return { data: null, error: new Error(`Unhandled API endpoint: ${url}`) };
      }
    
      // Handle axios-style config object where the first param is the config
      if (!isId(tableNameOrConfig) && !id) {
        const config = tableNameOrConfig;
        const url = config.url || '';
        
        logger.info('API GET request with config', { url, config });
        
        // Add handling for specific endpoints as needed
        return { data: null, error: new Error('Unimplemented config-style API call') };
      }
      
      // Handle traditional call pattern
      return isId(id) 
        ? getItemById(tableNameOrConfig as string, id)
        : { data: null, error: new Error('Invalid ID parameter') };
    }, { endpoint: typeof tableNameOrConfig === 'string' ? tableNameOrConfig : 'unknown' });
  },
  
  post: async (tableNameOrConfig: string | any, item?: any) => {
    return measurePerformance('api.post', async () => {
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
    }, { endpoint: typeof tableNameOrConfig === 'string' ? tableNameOrConfig : 'unknown' });
  },
  
  put: async (tableNameOrConfig: string | any, idOrItem?: string | any, item?: any) => {
    return measurePerformance('api.put', async () => {
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
    }, { endpoint: typeof tableNameOrConfig === 'string' ? tableNameOrConfig : 'unknown' });
  },
  
  delete: async (tableNameOrConfig: string | any, id?: string) => {
    return measurePerformance('api.delete', async () => {
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
    }, { endpoint: typeof tableNameOrConfig === 'string' ? tableNameOrConfig : 'unknown' });
  }
};
