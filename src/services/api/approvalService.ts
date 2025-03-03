
import api from './index';

export interface ApprovalFilter {
  status?: 'pending' | 'approved' | 'rejected';
  categoryId?: string;
  schoolId?: string;
  regionId?: string;
  sectorId?: string;
  page?: number;
  limit?: number;
}

const approvalService = {
  getPendingApprovals: async (filters: ApprovalFilter = {}) => {
    const response = await api.get('/approvals/pending', { params: filters });
    return response.data;
  },
  
  approveData: async (dataId: string, comment?: string) => {
    const response = await api.put(`/approvals/${dataId}/approve`, { comment });
    return response.data;
  },
  
  rejectData: async (dataId: string, reason: string) => {
    const response = await api.put(`/approvals/${dataId}/reject`, { reason });
    return response.data;
  },
  
  getApprovalHistory: async (filters: ApprovalFilter = {}) => {
    const response = await api.get('/approvals/history', { params: filters });
    return response.data;
  }
};

export default approvalService;
