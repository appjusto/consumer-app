import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

export const useNotificationHandler = () => {
  // state
  const [notification, setNotification] = useState<Notifications.Notification>();
  // handle notifications
  useEffect(() => {
    let isMounted = true;
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      setNotification(response.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      setNotification(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return notification;
};
