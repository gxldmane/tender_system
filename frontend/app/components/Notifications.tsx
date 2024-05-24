import { AlarmClock, Ban, Handshake } from "lucide-react"
import { IGetNotificationResponse, Notification } from "../http/types"
import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query";
import httpClient from "../http"
import { IErrorResponse } from "../http/httpClient";
interface NotificationsProps {
    notifications: Notification[]
}

function formatTenderText(text) {
    let tenderName = text.match(/тендер\s(.*?)\s(принята|отклонена|окончена)/)[1];
    let tenderStatus = text.match(/тендер\s(.*?)\s(принята|отклонена|окончена)/)[2];
    
    return text.replace(`тендер ${tenderName} ${tenderStatus}`, `тендер "${tenderName}" ${tenderStatus}`);
  }
  

const parseStatus = (status: string, unread: boolean) => {
    console.log('unread: ' + unread)
    switch (status) {
        case 'tenderClosed':
            return (
                <div className="flex items-center gap-2">
                    <AlarmClock className="h-5 w-5" color="#4f4f4f" />
                    <span className="font-medium">Тендер сменил статус</span>
                    {unread && <span className="bg-black text-white px-2 py-1 rounded-md text-xs font-medium">New</span>}
                </div>)
        case 'bid_accepted':
            return (
            <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5" color="#37c84f"/>
                <span className="font-medium">Заявка принята</span>
                {unread && <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">New</span>}
            </div>)
        case 'bid_declined':
            <div className="flex items-center gap-2">
                <Ban  className="h-5 w-5" color="#ff0000"/>
                <span className="font-medium">Заявка отклонена</span>
                {unread && <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">New</span>}
            </div>
        default:
            return 'Unknown'
    }
}

export default function NotificationsComponent({ notifications}: NotificationsProps) {
    let queryClient = useQueryClient();
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
        queryClient.refetchQueries['all-notifications']
        queryClient.refetchQueries['unread-notifications']
        return;
    }
    return (
        <>
            {
                notifications.map(notification => (
                    <Card key={notification.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {parseStatus(notification.type, notification.readaAt ? false : true)}
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{notification.tenderId && ("Тендер ID" + notification.tenderId)}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 dark:text-gray-400">{formatTenderText(notification.message)}</p>
                        </CardContent>
                        <CardFooter>
                            {notification.readaAt &&
                            <Button size="sm" variant="outline" onClick={(event) => handleClick(event, notification.id)}>
                                Mark as Read
                            </Button>}
                        </CardFooter>
                    </Card>))
            }
        </>
    )

}