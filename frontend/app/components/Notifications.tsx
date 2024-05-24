import { AlarmClock, Ban, Handshake, TagIcon } from "lucide-react"
import { IGetNotificationResponse, Notification } from "../http/types"
import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import httpClient from "../http"
import { IErrorResponse } from "../http/httpClient";
import Link from "next/link";
import { useState } from "react";
interface NotificationsProps {
    notifications: Notification[]
    showType: string
}

function formatTenderText(text) {
    let tenderName = text.match(/тендер\s(.*?)\s(принята|отклонена|окончена)/)[1];
    let tenderStatus = text.match(/тендер\s(.*?)\s(принята|отклонена|окончена)/)[2];

    return text.replace(`тендер ${tenderName} ${tenderStatus}`, `тендер "${tenderName}" ${tenderStatus}`);
}

function generatePseudoRandomString(seed) {
    // Создаем объект для генерации псевдо-случайных чисел
    const seedRandom = mulberry32(seed);
  
    // Функция для генерации случайных символов из заданного набора
    const getRandomChar = () => allowedChars[Math.floor(seedRandom() * allowedChars.length)];
  
    // Допустимые символы
    const allowedChars = 'ABCEHKMOPTX0123456789';
  
    // Генерируем первую часть строки (8 символов)
    let result = Array.from({ length: 4 }, getRandomChar).join('');
  
    // Добавляем seed
    result += `-${seed}-`;
  
    // Генерируем последнюю часть строки (6 символов)
    result += Array.from({ length: 4 }, getRandomChar).join('');
  
    return result;
  }
  
  // Вспомогательная функция для генерации псевдо-случайных чисел
  function mulberry32(seed) {
    return function () {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }



const parseStatus = (status: string, unread: boolean) => {
    console.log('unread: ' + unread)
    switch (status) {
        case 'tenderClosed':
            return (
                <div className="flex items-center gap-2">
                    <AlarmClock className="h-5 w-5" color="#4f4f4f" />
                    <span className="font-medium">Тендер сменил статус</span>
                    {unread && <span className="bg-black text-white px-2 py-1 rounded-md text-xs font-medium">Новое</span>}
                </div>)
        case 'bid_accepted':
            return (
                <div className="flex items-center gap-2">
                    <Handshake className="h-5 w-5" color="#37c84f" />
                    <span className="font-medium">Заявка принята</span>
                    {unread && <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">Новое</span>}
                </div>)
        case 'bid_declined':
            <div className="flex items-center gap-2">
                <Ban className="h-5 w-5" color="#ff0000" />
                <span className="font-medium">Заявка отклонена</span>
                {unread && <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">Новое</span>}
            </div>
        default:
            return 'Unknown'
    }
}

export default function NotificationsComponent({ notifications }: NotificationsProps) {
    const queryClient = useQueryClient();
    const handleClick = async (event, notificationId) => {
        const response = await queryClient.fetchQuery({
            queryKey: ['read'],
            queryFn: () => httpClient.getNotification(notificationId),
        }).then<IGetNotificationResponse | IErrorResponse | any>(value => value?.data);
        console.log("responsik: " + JSON.stringify(response));
        if (response?.errors) {
            console.log("Ошибка")
            return;
        }
        await queryClient.refetchQueries({ queryKey: ['all-notifications'], type: 'active' })
        await queryClient.refetchQueries({ queryKey: ['unread-notifications'], type: 'active' })
    }
    return (
        <>
            {
                notifications.map(notification => (
                    <Link className="block transition-transform hover:-translate-y-1" href={notification.type == "tenderClosed" ? `/view-more?tenderId=${notification.tenderId}` : "./bids"}>
                        <Card key={notification.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {parseStatus(notification.type, notification.readAt ? false : true)}
                                    </div>
                                    {notification.tenderId && 
                                    <div className="flex items-center gap-2 text-sm">
                                        <TagIcon className="h-4 w-4" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{(generatePseudoRandomString(notification.tenderId))}</span>
                                    </div>}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500 dark:text-gray-400">{formatTenderText(notification.message)}</p>
                            </CardContent>
                            <CardFooter className="w-full flex justify-between">
                                {!notification.readAt &&
                                    <Button size="sm" variant="outline" onClick={(event) => {
                                        handleClick(event, notification.id)
                                        event.preventDefault();
                                    }}>
                                        Отметить как прочитанное
                                    </Button>
                                }
                            </CardFooter>
                        </Card>
                    </Link>))
            }
        </>
    )

}