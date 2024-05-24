"use client"

import { Button } from "@/components/ui/button"
import { AlarmClock, BellIcon, CircleCheck } from "lucide-react"
import { useQuery } from "@tanstack/react-query";
import httpClient from "@/app/http";
import { IGetNotificationsResponse } from "@/app/http/types";
import useNotifications from "@/app/components/useNotifications";
import { useState } from "react";
import { cn } from "@/lib/utils";
import NotificationsComponent from "@/app/components/Notifications";


export default function SettingsNotificationsPage() {
  const [chosenShowType, setChosenShowType] = useState('unread')
  const { data: allNotifications, isFetching, isError } = useQuery({
    queryKey: ['all-notifications'],
    queryFn: () => httpClient.getAllNotifications(),
    select: response => response?.data as IGetNotificationsResponse,
  });
  const { data: unreadNotifications, isFetching: isUnreadFetching, isError: isUnreadError } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: () => httpClient.getUnreadNotificationsForPage(),
    select: response => response?.data as IGetNotificationsResponse,
  });

  const handleClick = (showType: string) => {
    setChosenShowType(showType)
  }

  if (!isFetching && !isUnreadFetching && (!allNotifications && !unreadNotifications)) {
    return <>No data</>
  }


return (
  <main className="flex flex-col gap-6 p-6 md:p-10">
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Уведомления</h1>
        <div className="flex items-center gap-2">
          <Button className={cn("px-3 py-1 rounded-md", chosenShowType === "unread" && "bg-gray-200")} size="sm" variant="ghost" onClick={() => handleClick('unread')}>
            Непрочитанные
          </Button>
          <Button className={cn("px-3 py-1 rounded-md", chosenShowType === "all" && "bg-gray-200")} size="sm" variant="ghost" onClick={() => handleClick('all')}>
            Все
          </Button>
        </div>
      </div>
    </header>
    {isFetching || isUnreadFetching ? <div>Loading...</div> :
    <div className="grid gap-4">
      {chosenShowType == 'unread' ? 
      <NotificationsComponent notifications={unreadNotifications.data}/> : 
      <NotificationsComponent notifications={allNotifications.data} />}
    </div>}
  </main>
)
}