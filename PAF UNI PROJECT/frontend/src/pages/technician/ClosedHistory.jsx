import React from 'react';
import TechnicianTicketListView from './TechnicianTicketListView';

const ClosedHistory = () => {
  return (
    <TechnicianTicketListView 
      title="Closed History" 
      subtitle="Permanently closed and archived support requests." 
      pageType="closed"
    />
  );
};

export default ClosedHistory;
