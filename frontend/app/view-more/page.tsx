"use client"
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

import { Tabs, TabsContent, } from "@/components/ui/tabs"

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"

import httpClient from '../http';
import ActionList from '../components/ActionList';
import { useQuery } from "@tanstack/react-query";
import { ITenderDetails } from "@/app/http/types";
import useUser from "@/app/components/useUser";
import { DollarSign } from "lucide-react";
import useToken from "@/app/components/useToken";

function daysSinceTenderCreation(createdAt) {
  const tenderDate = new Date(createdAt);
  const today = new Date();
  // @ts-ignore -- какая-то ошибка с типами
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


// Заменить на false, если заявка не отправлена

export default function ViewMore() {
  const searchParams = useSearchParams();
  const currentTenderId = searchParams.get('tenderId');
  const router = useRouter();
  const { userDetails, isFetching: isUserFetching } = useUser();
  // Это крутая обертка над аксиосом, которая умеет кэшировать ответы от бэка и НЕ ТОЛЬКО
  // Читай доки, пж https://tanstack.com/query/latest/docs/framework/react/guides/queries
  // Он может обрабатывать ошибки и НЕ ТОЛЬКО, все в документации
  //
  // Вот еще гайд https://www.youtube.com/watch?v=ICYpPLtdIcQ
  // НО ОН БЛИН ДЛЯ 4-ой версии, у нас щас пятая версия, но там НЕмного поменялось
  //
  // ЭТО ГАЙД ДЛЯ МИГРАЦИИ С 4-ой на пятую ЕСЛИ ЧЕТО НЕПОНЯТНО!!!!!!!!
  // https://dreamix.eu/insights/tanstack-query-v5-migration-made-easy-key-aspects-breaking-changes/

  const { data: tenderDetails, isFetching, isError } = useQuery({
    queryKey: ['tender'],
    queryFn: () => httpClient.getTenderInfo(currentTenderId),
    select: response => response?.data?.data as ITenderDetails & { files: string[] },
  });

  // todo: получать с бэка инфу об этом?
  const [authIsBidded, setAuthIsBidded] = useState(false);
  const handleBidChange = (newBiddedValue: boolean) => {
    setAuthIsBidded(newBiddedValue);
  };

  const { isFetching: isTokenFetching , authToken } = useToken();
  if (isTokenFetching) return;
  if (!authToken) {
    // if user is not authenticated
    router.push("/login");
    return;
  }

  console.log("user = ", userDetails);

  return (
    <div className="container hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          {isFetching || !tenderDetails ? (
            <Skeleton className="h-24 w-full rounded-md"/>
          ) : (
            <h2 className="text-3xl font-bold tracking-tight">Тендер: {tenderDetails.name}</h2>
          )}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            {isUserFetching || isFetching || !tenderDetails ? (
              <Skeleton className="h-24 w-full rounded-md"/>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Начальная цена
                      </CardTitle>
                      <DollarSign />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₽ {(tenderDetails.start_price).toLocaleString('ru')}</div>
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
                        Категория №{tenderDetails.categoryId}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Создан:</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{new Date(tenderDetails.createdAt).toLocaleDateString()}</div>
                      <p className="text-xs text-muted-foreground">
                        {daysSinceTenderCreation(tenderDetails.createdAt)}
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
                      <div className="text-xl font-bold">{getRemainingTime(tenderDetails.untilDate)}</div>
                      <p className="text-xs text-muted-foreground">
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 min-h-40">
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        Описание тендера
                      </CardTitle>
                    </CardHeader>
                    <CardContent className=''>
                      <div className='text-xl font-medium break-words'>
                        {tenderDetails.description}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        Действия
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='flex items-center gap-x-2.5'>
                        <ActionList tenderId={currentTenderId} userRole={userDetails?.role} isBidded={authIsBidded}
                                    onBidChange={handleBidChange} isCreator={tenderDetails.customerId === userDetails?.id}/>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


{/* <p>Создан:<br></br> {new Date(createdAt).toLocaleDateString()}</p>
<p>До окончания:<br></br> {getRemainingTime(untilDate)}</p> */
}
