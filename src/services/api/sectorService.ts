
import api from './index';

export interface SectorData {
  id?: string;
  name: string;
  description?: string;
  regionId: string;
}

export interface SectorFilter {
  regionId?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

const sectorService = {
  getSectors: async (filters: SectorFilter = {}) => {
    const response = await api.get('/sectors', { params: filters });
    return response.data;
  },
  
  createSector: async (sectorData: SectorData) => {
    const response = await api.post('/sectors', sectorData);
    return response.data;
  },
  
  getSector: async (id: string) => {
    const response = await api.get(`/sectors/${id}`);
    return response.data;
  },
  
  updateSector: async (id: string, sectorData: Partial<SectorData>) => {
    const response = await api.put(`/sectors/${id}`, sectorData);
    return response.data;
  },
  
  deleteSector: async (id: string) => {
    const response = await api.delete(`/sectors/${id}`);
    return response.data;
  }
};

export default sectorService;
