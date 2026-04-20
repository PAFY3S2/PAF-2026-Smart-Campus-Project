import React from 'react';
import TechnicianTicketListView from './TechnicianTicketListView';

const ClosedHistory = () => {
  return (
    <TechnicianTicketListView 
      title="Resolution History" 
      subtitle="Comprehensive archive of all closed and historical service requests." 
      filter={(t) => t.status === 'CLOSED'}
    />
  );
};

export default ClosedHistory;
