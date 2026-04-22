import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useTechnicianStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/technician/dashboard/stats');
      return data;
    }
  });
};
