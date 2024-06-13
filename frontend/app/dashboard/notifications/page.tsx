"use client"

import { Button } from "@/components/ui/button"
import { AlarmClock, BellIcon, CircleCheck, FilterIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query";
import httpClient from "@/app/http";
import { IGetNotificationsResponse } from "@/app/http/types";
import useNotifications from "@/app/components/useNotifications";
import { useState } from "react";
import { cn } from "@/lib/utils";
import NotificationsComponent from "@/app/components/Notifications";
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"

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
    console.log(chosenShowType)
  }

  if (!isFetching && !isUnreadFetching && (!allNotifications && !unreadNotifications)) {
    return <>No data</>
  }

  if (!isFetching && !isUnreadFetching) {
    console.log(allNotifications)
    console.log(unreadNotifications)
  }


  return (
    <main className="flex flex-col gap-6 p-6 pt-0 md:p-10 md:pt-0">
      <header className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Уведомления</h1>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="px-3 py-1 rounded-md flex items-center gap-2" size="sm" variant="ghost">
                <span className="text-base text-black">{chosenShowType == "unread" ? "Непрочитанные" : "Все"}</span>
                <FilterIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 space-y-2">
              <DropdownMenuItem asChild onClick={() => handleClick("unread")} className="cursor-pointer">
                  <div className="flex justify-between">
                    <span>Непрочитанные</span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-50 px-2 py-1 rounded-full text-xs font-medium">
                      {unreadNotifications?.data?.length}
                    </span>
                  </div>
              </DropdownMenuItem>
              <DropdownMenuItem asChild onClick={() => handleClick("all")} className="cursor-pointer">
                  <div className="flex justify-between">
                    <span>Все</span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-50 px-2 py-1 rounded-full text-xs font-medium">
                      {allNotifications?.data?.length}
                    </span>
                  </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {isFetching || isUnreadFetching ? <div></div> : 
        <div className="grid gap-4">
          {chosenShowType == 'unread' ?
            <NotificationsComponent notifications={unreadNotifications.data} showType={chosenShowType} /> :
            <NotificationsComponent notifications={allNotifications.data} showType={chosenShowType} />}
        </div>}
      {!isUnreadFetching && chosenShowType == "unread" && unreadNotifications.data.length == 0 && <>Нет непрочитанных уведомлений</>}
      {!isFetching && chosenShowType == "all" && allNotifications.data.length == 0 && <>Нет непрочитанных уведомлений</>}
    </main>
  )
}