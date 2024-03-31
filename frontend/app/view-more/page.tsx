"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import httpClient from '../http';

function daysSinceTenderCreation(createdAt) {
  const tenderDate = new Date(createdAt);
  const today = new Date();
  const differenceInDays = Math.floor((today - tenderDate) / (1000 * 60 * 60 * 24));

  let timeSinceCreation;
  if (differenceInDays === 0) {
    timeSinceCreation = "Сегодня";
  } else if (differenceInDays === 1) {
    timeSinceCreation = "Вчера";
  } else {
    timeSinceCreation = `${differenceInDays} дней назад`;
  }

  return timeSinceCreation;
}

function getRemainingTime(untilDate: string): string {
  const now = new Date();
  const endDate = new Date(untilDate);
  const diff = endDate.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let remainingText = "";
  if (days > 0) {
    remainingText += `${days} дней, `;
  }
  if (hours > 0) {
    remainingText += `${hours} часов, `;
  }
  remainingText += `${minutes} минут`;

  return remainingText;
}


const userRole = "customer"; // Заменить на "executor" для исполнителя
const isBidSended = true; // Заменить на false, если заявка не отправлена

interface TenderData {
  name: string;
  description: string;
  start_price: number;
  categoryId: number;
  createdAt: string;
  untilDate: string;
}

export default function ViewMore() {
  const searchParams = useSearchParams();
  const tenderId = parseInt(searchParams.get('tenderId') as string);
  const [tenderData, setTenderData] = useState<TenderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenderInfo = async () => {
      setIsLoading(true);
      try {
        const response = await httpClient.getTenderInfo(tenderId);
        setTenderData(response.data);
      } catch (error) {
        console.error('Error fetching tender data:', error);
        setError('Не удалось получить данные тендера');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTenderInfo();
  }, [tenderId]);
  if (!tenderData) return <div>Loading...</div>;
  return (
    <div className="container hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Тендер: {tenderData.name}</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Начальная цена
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₽ {(tenderData.start_price).toLocaleString('ru')}</div>
                  <p className="text-xs text-muted-foreground">
                    Цена установленая заказчиком
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Категория тендера
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">category_name</div>
                  <p className="text-xs text-muted-foreground">
                    Категория №{tenderData.categoryId}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Создан:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Date(tenderData.createdAt).toLocaleDateString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {daysSinceTenderCreation(tenderData.createdAt)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    До окончания:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{getRemainingTime(tenderData.untilDate)}</div>
                  <p className="text-xs text-muted-foreground">
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}





{/* <p>Создан:<br></br> {new Date(createdAt).toLocaleDateString()}</p>
<p>До окончания:<br></br> {getRemainingTime(untilDate)}</p> */}
