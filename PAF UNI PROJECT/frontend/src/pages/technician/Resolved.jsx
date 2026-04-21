import React from 'react';
import TechnicianTicketListView from './TechnicianTicketListView';

const Resolved = () => {
  return (
    <TechnicianTicketListView 
      title="Resolution Archive" 
      subtitle="Completed assignments and archived resolutions." 
      pageType="resolved"
    />
  );
};

export default Resolved;
