import { useEffect } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const socket = io('http://localhost:3300'); // Match your backend URL

const AgentNotifications = () => {
  useEffect(() => {
    // Connect to WebSocket
    socket.on('connect', () => {
      console.log('Connected to notification server');
    });

    // Listen for low stock alerts
    socket.on('LOW_STOCK_ALERT', (data) => {
      toast.warning(
        `Low stock alert: ${data.product.name} (${data.product.stock} remaining)`, 
        {
          position: "top-right",
          autoClose: false, // Don't auto-close
          closeOnClick: false,
          draggable: true,
        }
      );
    });

    return () => {
      socket.off('LOW_STOCK_ALERT');
      socket.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AgentNotifications;