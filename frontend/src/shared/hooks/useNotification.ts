import { useState, useCallback, useEffect, useRef } from 'react';

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  action?: { label: string; onClick: () => void };
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info',
  });
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const hideNotification = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  const showNotification = useCallback((
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
    action?: { label: string; onClick: () => void },
    duration?: number
  ) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNotification({
      show: true,
      message,
      type,
      action,
    });
    if (duration) {
      timeoutRef.current = window.setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, duration);
    }
  }, []);

  return { notification, showNotification, hideNotification };
};
