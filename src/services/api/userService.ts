
import api from './index';

export interface UserData {
  id?: string;
  email: string;
  name: string;
  surname: string;
  role: string;
  entityId?: string;
  entityName?: string;
  password?: string;
}

export interface UserFilter {
  role?: string;
  entityId?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

const userService = {
  getUsers: async (filters: UserFilter = {}) => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },
  
  createUser: async (userData: UserData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: string, userData: Partial<UserData>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  
  importUsers: async (fileData: FormData) => {
    const response = await api.post('/users/import', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  exportUsers: async (filters: UserFilter = {}) => {
    const response = await api.get('/users/export', { 
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};

export default userService;
