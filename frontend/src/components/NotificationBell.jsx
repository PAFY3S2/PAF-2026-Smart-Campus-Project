import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, ShieldAlert } from 'lucide-react';
import api from '../services/api';

const NotificationBell = ({ liveNotifications }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    // Initial fetch of unread notifications
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications/unread');
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (liveNotifications && liveNotifications.length > 0) {
      // Append newly received live notifications (filter out duplicates based on ID if needed)
      // Since useWebSocket prepends to liveNotifications, we just merge carefully or re-fetch.
      // To keep it simple, we just merge all live notifications and current state and remove duplicates
      setNotifications(prev => {
         const combined = [...liveNotifications, ...prev];
         const unique = Array.from(new Set(combined.map(a => a.id)))
           .map(id => {
             return combined.find(a => a.id === id)
           });
         return unique.filter(n => !n.read); // Only keep unread
      });
    }
  }, [liveNotifications]);
  
  useEffect(() => {
    // Close panel on outside click
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  const IconType = ({ type }) => {
    switch (type) {
      case 'BOOKING': return <span className="text-blue-500 bg-blue-100 p-1 rounded-md text-xs font-semibold">BOOKING</span>;
      case 'TICKET': return <span className="text-orange-500 bg-orange-100 p-1 rounded-md text-xs font-semibold">TICKET</span>;
      case 'COMMENT': return <span className="text-purple-500 bg-purple-100 p-1 rounded-md text-xs font-semibold">COMMENT</span>;
      default: return <ShieldAlert size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
      >
        <Bell size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full shadow-sm animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white bg-opacity-95 backdrop-blur-md border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            <span className="text-xs bg-gray-200 text-gray-600 py-1 px-2 rounded-full font-medium">
              {notifications.length} Unread
            </span>
          </div>
          
          <div className="max-h-96 overflow-y-auto w-full">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Bell size={32} className="text-gray-300 mb-3" />
                <p>No new notifications</p>
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group flex items-start gap-4">
                    <div className="mt-1">
                      <IconType type={notification.type} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">{notification.message}</p>
                      <span className="text-xs text-gray-400 font-medium">{new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
