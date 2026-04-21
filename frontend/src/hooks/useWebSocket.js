import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

export const useWebSocket = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const stompClient = new Client({
      brokerURL: 'ws://localhost:8081/ws',
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      stompClient.subscribe(`/user/${userId}/queue/notifications`, (notification) => {
        const newNotification = JSON.parse(notification.body);
        setNotifications((prev) => [newNotification, ...prev]);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [userId]);

  return { notifications, setNotifications, client };
};
