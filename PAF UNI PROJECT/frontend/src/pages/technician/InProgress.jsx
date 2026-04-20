import React from 'react';
import TechnicianTicketListView from './TechnicianTicketListView';

const InProgress = () => {
  return (
    <TechnicianTicketListView 
      title="In Progress Queue" 
      subtitle="Currently active field operations and technical tasks." 
      filter={(t) => t.status === 'IN_PROGRESS'}
    />
  );
};

export default InProgress;
