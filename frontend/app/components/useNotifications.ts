import { IGetNotificationsResponse } from "@/app/http/types";
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
  localStorage.setItem('notifications_data', JSON.stringify(notificationsDetails));
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