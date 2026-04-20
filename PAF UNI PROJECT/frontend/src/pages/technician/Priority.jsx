import React from 'react';
import TechnicianTicketListView from './TechnicianTicketListView';

const Priority = () => {
  return (
    <TechnicianTicketListView 
      title="Priority Incidents" 
      subtitle="Critical and high-impact issues requiring immediate technical response." 
      filter={(t) => t.priority === 'HIGH' || t.priority === 'URGENT'}
    />
  );
};

export default Priority;
