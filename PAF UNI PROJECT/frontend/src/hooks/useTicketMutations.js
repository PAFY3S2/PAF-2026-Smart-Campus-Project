import { useMutation, useQueryClient } from '@tanstack/react-query';
import ticketApi from '../services/ticketApi';
import { toast } from 'sonner';

export const useTicketMutations = (ticketId) => {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: (status) => ticketApi.updateStatus(ticketId, status),
    onSuccess: (res) => {
      queryClient.setQueryData(['ticket', ticketId], (old) => ({ ...old, status: res.data.status }));
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Status updated successfully');
    },
    onError: () => toast.error('Failed to update status')
  });

  const sendMessage = useMutation({
    mutationFn: (content) => ticketApi.sendMessage(ticketId, content),
    onSuccess: (res) => {
      queryClient.setQueryData(['ticket', ticketId], (old) => ({
        ...old,
        comments: [...(old.comments || []), res.data]
      }));
      toast.success('Message transmitted');
    },
    onError: () => toast.error('Communication error')
  });

  const addNote = useMutation({
    mutationFn: (content) => ticketApi.addNote(ticketId, content),
    onSuccess: (res) => {
      queryClient.setQueryData(['ticket', ticketId], (old) => ({
        ...old,
        ticketNotes: [...(old.ticketNotes || []), res.data]
      }));
      toast.success('Internal note documented');
    },
    onError: () => toast.error('Failed to document note')
  });

  return { updateStatus, sendMessage, addNote };
};
