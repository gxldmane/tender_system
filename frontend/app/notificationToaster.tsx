"use client"

import { useQuery } from "@tanstack/react-query";
import httpClient from "./http";
import { IGetNotificationsResponse } from "./http/types";
import useUser from "./components/useUser";
import useNotifications from "./components/useNotifications";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";



export default function NotificationToaster() {
    const { userDetails, isFetching } = useUser();
    const { saveNotificationsData } = useNotifications();

    const { data: allNotificationResponse, isFetching: isAllNotificationsFetching, isError: isAllNotificationError } = useQuery({
      queryKey: ['notifications'],
      queryFn: () => httpClient.getUnreadNotifications(saveNotificationsData),
      select: (data) => data?.data as IGetNotificationsResponse,
      refetchInterval: 5000, // 5 seconds
    });
  
  
    if (!userDetails) {
      return null;
    }
  
    if (!allNotificationResponse) {
      return <div>Error fetching notifications.</div>;
    }

    return(<div>
      <p>Notifications fetched</p>
    </div>)
  
  
    // Остальной код
  }
