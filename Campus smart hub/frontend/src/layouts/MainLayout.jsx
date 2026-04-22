import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
      <Sidebar />

      <div className="flex flex-col flex-1 lg:pl-72 overflow-hidden w-full">
        <Navbar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none scroll-smooth">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 blur-[120px] -mr-64 -mt-64 rounded-full pointer-events-none transition-opacity" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 dark:bg-accent/10 blur-[100px] -ml-40 -mb-40 rounded-full pointer-events-none transition-opacity" />
          
          <div className="py-8 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto w-full min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
