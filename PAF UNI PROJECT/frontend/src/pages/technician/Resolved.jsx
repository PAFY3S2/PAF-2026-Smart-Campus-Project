import React from 'react';
import TechnicianTicketListView from './TechnicianTicketListView';

const Resolved = () => {
  return (
    <TechnicianTicketListView 
      title="Resolved Archive" 
      subtitle="Tickets that have been successfully addressed and verified." 
      filter={(t) => t.status === 'RESOLVED'}
    />
  );
};

export default Resolved;
