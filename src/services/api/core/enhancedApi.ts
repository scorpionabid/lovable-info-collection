import { isId } from '../utils/helpers';
import { 
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem 
} from './crudOperations';
import { getSectors, getSectorById } from '@/services/supabase/sector';
import { logger } from '@/utils/logger';
import { measurePerformance } from '@/utils/performanceMonitor';

// API interfeysi təkmilləşdirilib və birbaşa Supabase sorğuları ilə əvəz ediləcək
export const enhancedApi = {
  // Əsas metodlar
  fetchItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  
  // Təkmilləşdirilmiş metodlar
  get: async (tableNameOrConfig: string | any, id?: string | any) => {
    // Performans monitorinqi
    return measurePerformance('api.get', async () => {
      // URL string və config obyekt paterni
      if (typeof tableNameOrConfig === 'string' && tableNameOrConfig.startsWith('/')) {
        const url = tableNameOrConfig;
        const params = id && typeof id === 'object' ? id.params : {};
        
        logger.info('API GET request', { url, params });
        
        // Endpoint əsasında müvafiq Supabase sorğusuna yönləndir
        if (url === '/sectors') {
          try {
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
        
        // ID ilə müəyyən sektor
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
      
        // Digər endpointlər üçün xəbərdarlıq və boş nəticə
        logger.warn(`Unhandled API endpoint: ${url}`);
        return { data: null, error: new Error(`Unhandled API endpoint: ${url}`) };
      }
    
      // axios-style config obyekti
      if (!isId(tableNameOrConfig) && !id) {
        const config = tableNameOrConfig;
        const url = config.url || '';
        
        logger.info('API GET request with config', { url, config });
        
        // Lazım olduqda digər endpointlər əlavə edin
        return { data: null, error: new Error('Unimplemented config-style API call') };
      }
      
      // Ənənəvi çağırış paterni
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
