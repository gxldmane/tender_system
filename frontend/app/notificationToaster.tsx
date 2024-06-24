"use client";

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import httpClient from './http';
import { IGetNotificationsResponse } from './http/types';
import useNotifications from './components/useNotifications';
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export default function NotificationToaster() {
  const { saveNotificationsData } = useNotifications();
  const router = useRouter();

  const { data: allNotificationResponse, isFetching: isAllNotificationsFetching } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => httpClient.getUnreadNotifications(saveNotificationsData),
    select: (data) => data?.data as IGetNotificationsResponse,
    refetchInterval: 5000, // 5 seconds
  });

  useEffect(() => {
    if (!isAllNotificationsFetching && allNotificationResponse?.data) {
      let unreadCount = 0;
      allNotificationResponse.data.forEach(notification => {
        const storedNotifications = localStorage.getItem('readNotifications') ? JSON.parse(localStorage.getItem('readNotifications')) : [];
        if (!storedNotifications.includes(notification.id)) {
          console.log(notification.message);
          unreadCount++;
          storedNotifications.push(notification.id);
          localStorage.setItem('readNotifications', JSON.stringify(storedNotifications));
        }
      });
      if (unreadCount <= 0) {
        return;
      }
      toast({
        variant: "default",
        title: "Уведомление",
        description: `У тебя ${unreadCount} новых уведомлений.`,
        action: <ToastAction altText="Посмотреть">Посмотреть</ToastAction>,
        duration: 600_000,
        onClick: () => router.push("/dashboard/notifications"),
      });
    }
  }, [allNotificationResponse, isAllNotificationsFetching]);

  return (<></>);
}