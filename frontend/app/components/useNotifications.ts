import { IGetNotificationsResponse, Notification } from "@/app/http/types";
import { useEffect, useState } from "react";

async function fetchNotificationsData(): Promise<IGetNotificationsResponse> {
  const notificationsData = await localStorage.getItem('notifications_data');
  if (!notificationsData || notificationsData == "undefined" || notificationsData.length != 0) {
    invalidateNotificationsData()
    return null;
  }
  return await JSON.parse(notificationsData);
}

function saveNotificationsData(notificationsDetails: IGetNotificationsResponse): void {
  const notificationsData = localStorage.getItem('notifications_data');
  const currentNewNotifications = localStorage.getItem('new_notifications')
  const parsedData = JSON.parse(notificationsData);
  if (parsedData) {
    const newNotifications = notificationsDetails.data.filter(
      (newNotification) =>
        !parsedData.notifications.some(
          (existingNotification) =>
            existingNotification.id === newNotification.id
        )
    );
  }

  else {
    const newNotifications = notificationsDetails;
    console.log("Новые уведомления");
    console.log(newNotifications);
    localStorage.setItem('notifications_data', JSON.stringify(notificationsDetails));
    localStorage.setItem('new_notifications', JSON.stringify(newNotifications));
  }
}

function invalidateNotificationsData(): void {
  localStorage.removeItem('notifications_data');
}

interface UseNotificationsHook {
  isFetching: boolean;
  notificationsDetails: IGetNotificationsResponse;
  saveNotificationsData: (notificationDetails: IGetNotificationsResponse) => void;
  invalidateNotificationsData: () => void;
}

export default function useNotifications(): UseNotificationsHook {
  const [notificationsDetails, setNotificationsDetails] = useState<IGetNotificationsResponse>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchNotifications = async () => {
      const details = await fetchNotificationsData();
      setIsLoading(false);
      if (!details) return;
      setNotificationsDetails(details);
    };
    fetchNotifications();
  }, []);



  return { notificationsDetails, isFetching: isLoading, saveNotificationsData, invalidateNotificationsData };
};