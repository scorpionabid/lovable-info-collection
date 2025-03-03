
import api from './index';

export interface RegionData {
  id?: string;
  name: string;
  description?: string;
}

export interface RegionFilter {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

const regionService = {
  getRegions: async (filters: RegionFilter = {}) => {
    const response = await api.get('/regions', { params: filters });
    return response.data;
  },
  
  createRegion: async (regionData: RegionData) => {
    const response = await api.post('/regions', regionData);
    return response.data;
  },
  
  getRegion: async (id: string) => {
    const response = await api.get(`/regions/${id}`);
    return response.data;
  },
  
  updateRegion: async (id: string, regionData: Partial<RegionData>) => {
    const response = await api.put(`/regions/${id}`, regionData);
    return response.data;
  },
  
  deleteRegion: async (id: string) => {
    const response = await api.delete(`/regions/${id}`);
    return response.data;
  }
};

export default regionService;
