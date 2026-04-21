import React from 'react';
import TechnicianTicketListView from './TechnicianTicketListView';

const InProgress = () => {
  return (
    <TechnicianTicketListView 
      title="In Progress Queue" 
      subtitle="Currently active field operations and technical tasks." 
      pageType="in-progress"
    />
  );
};

export default InProgress;
