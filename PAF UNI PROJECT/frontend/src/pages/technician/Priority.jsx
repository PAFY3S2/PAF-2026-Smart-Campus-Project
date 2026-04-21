import React from 'react';
import TechnicianTicketListView from './TechnicianTicketListView';

const Priority = () => {
  return (
    <TechnicianTicketListView 
      title="Priority Response" 
      subtitle="Critical incidents requiring immediate technical response." 
      pageType="priority"
    />
  );
};

export default Priority;
