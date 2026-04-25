import { useQuery } from '@tanstack/react-query';
import ticketApi from '../services/ticketApi';

export const useTicketDetails = (ticketId) => {
  const ticketQuery = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const { data } = await ticketApi.getTicket(ticketId);
      return data;
    },
    enabled: !!ticketId
  });

  const evidenceQuery = useQuery({
    queryKey: ['ticket-evidence', ticketId],
    queryFn: async () => {
      const { data } = await ticketApi.getEvidence(ticketId);
      return data;
    },
    enabled: !!ticketId && !!ticketQuery.data // Only fetch if ticket exists
  });

  return {
    ticket: ticketQuery.data,
    isLoading: ticketQuery.isLoading,
    error: ticketQuery.error,
    evidence: evidenceQuery.data || [],
    isEvidenceLoading: evidenceQuery.isLoading
  };
};
