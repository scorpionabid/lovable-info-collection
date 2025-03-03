
import api from './index';

export interface DataEntryFilter {
  categoryId: string;
  schoolId: string;
}

const dataEntryService = {
  getData: async (categoryId: string, schoolId: string) => {
    const response = await api.get(`/data-entry/${categoryId}/${schoolId}`);
    return response.data;
  },
  
  submitData: async (categoryId: string, schoolId: string, formData: Record<string, any>) => {
    const response = await api.post(`/data-entry/${categoryId}/${schoolId}`, formData);
    return response.data;
  },
  
  updateData: async (dataId: string, formData: Record<string, any>) => {
    const response = await api.put(`/data-entry/${dataId}`, formData);
    return response.data;
  },
  
  getTemplate: async (categoryId: string) => {
    const response = await api.get(`/data-entry/template/${categoryId}`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  importData: async (fileData: FormData) => {
    const response = await api.post('/data-entry/import', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getHistory: async (dataId: string) => {
    const response = await api.get(`/data-entry/history/${dataId}`);
    return response.data;
  }
};

export default dataEntryService;
