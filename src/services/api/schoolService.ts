import api from './index';

export interface SchoolData {
  id?: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  region_id: string;
  sector_id: string;
  type_id: string;
  status: 'active' | 'inactive';
}

export interface SchoolFilter {
  region_id?: string;
  sector_id?: string;
  type_id?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const schoolService = {
  getSchools: async (filters: SchoolFilter = {}) => {
    const response = await api.get('/schools', { params: filters });
    return response.data;
  },
  
  createSchool: async (schoolData: SchoolData) => {
    const response = await api.post('/schools', schoolData);
    return response.data;
  },
  
  getSchool: async (id: string) => {
    const response = await api.get(`/schools/${id}`);
    return response.data;
  },
  
  updateSchool: async (id: string, schoolData: Partial<SchoolData>) => {
    const response = await api.put(`/schools/${id}`, schoolData);
    return response.data;
  },
  
  deleteSchool: async (id: string) => {
    const response = await api.delete(`/schools/${id}`);
    return response.data;
  },
  
  importSchools: async (fileData: FormData) => {
    const response = await api.post('/schools/import', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  exportSchools: async (filters: SchoolFilter = {}) => {
    const response = await api.get('/schools/export', { 
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};

export default schoolService;
