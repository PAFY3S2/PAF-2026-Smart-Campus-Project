import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'sonner';

export const useTickets = (type = 'active', params = {}) => {
  const endpoint = type === 'active' ? '/technician/active-assignments' : `/technician/${type}`;
  
  return useQuery({
    queryKey: ['tickets', type, params],
    queryFn: async () => {
      const { data } = await api.get(endpoint, { params });
      return data;
    },
  });
};

/**
 * 🔹 Fetch a single ticket by ID
 */
export const useTicket = (id) => {
  return useQuery({
    queryKey: ['ticket', id], // cache key

    queryFn: async () => {
      const { data } = await api.get(`/tickets/${id}`); // GET single ticket
      return data;
    },

    // Only run query if ID exists
    enabled: !!id,
  });
};

/**
 *  Fetch comments for a ticket
 */
export const useComments = (ticketId) => {
  return useQuery({
    queryKey: ['comments', ticketId],

    queryFn: async () => {
      const { data } = await api.get(`/tickets/${ticketId}/comments`);
      return data;
    },

    // Run only if ticketId exists
    enabled: !!ticketId,
  });
};

/**
 * 🔹 Update ticket status (PATCH request)
 */
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient(); // access cache

  return useMutation({
    // Function to update status in backend
    mutationFn: async ({ id, status }) => {
      const { data } = await api.patch(`/tickets/${id}/status`, { status });
      return data;
    },

    // When update is successful
    onSuccess: (_, variables) => {
      // Refresh related cached data
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

      // Show success message
      toast.success(`Ticket marked as ${variables.status.toLowerCase()}`);
    },

    // If error happens
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};

export const useAddTicketNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }) => {
      const { data } = await api.post(`/technician/tickets/${id}/notes`, { note });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
      toast.success('Internal note encrypted and saved');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save tactical note');
    },
  });
};

export const useCommentMutations = (ticketId) => {
  const queryClient = useQueryClient();

  const addComment = useMutation({
    mutationFn: async (body) => {
      const { data } = await api.post(`/tickets/${ticketId}/comments`, { body });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
      toast.success('Comment added');
    },
  });

  const updateComment = useMutation({
    mutationFn: async ({ commentId, body }) => {
      const { data } = await api.put(`/tickets/${ticketId}/comments/${commentId}`, { body });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
      toast.success('Comment updated');
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId) => {
      await api.delete(`/tickets/${ticketId}/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
      toast.success('Comment deleted');
    },
  });

  return { addComment, updateComment, deleteComment };
};
