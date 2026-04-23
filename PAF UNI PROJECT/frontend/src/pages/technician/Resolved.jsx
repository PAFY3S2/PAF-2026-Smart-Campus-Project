import React from 'react';

import TechnicianTicketListView from './TechnicianTicketListView';

const Resolved = () => {
  return (
    // Reusing the same component but passing different props
    <TechnicianTicketListView 
        
      title="Resolution Archive" 

      subtitle="Completed assignments and archived resolutions." 

      pageType="resolved"
      //  tells the component what type of data to fetch
    />
  );
};

export default Resolved;


/**
 * 
Resolved.jsx
   ↓ (passes props)
TechnicianTicketListView.jsx
   ↓ (API call using pageType)
Backend API (/tickets?status=resolved)
   ↓
Database
   ↓
Response JSON
   ↓
Rendered UI
 */