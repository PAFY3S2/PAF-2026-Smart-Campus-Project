import React from 'react';
import TechnicianTicketListView from './TechnicianTicketListView';

const Priority = () => {
  return (
    <TechnicianTicketListView 
      title="Priority Operations" 
      subtitle="Global urgent task queue. View and claim high-priority institutional failures." 
      pageType="priority"
    />
  );
};

export default Priority;
