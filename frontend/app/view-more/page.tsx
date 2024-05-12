"use client"
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

import { Tabs, TabsContent, } from "@/components/ui/tabs"

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"

import httpClient from '../http';
import ActionList from '../components/ActionList';
import { useQuery } from "@tanstack/react-query";
import { Category, ICategoryResponse, ITenderDetails, Region } from "@/app/http/types";
import useUser from "@/app/components/useUser";
import { RussianRuble, FolderIcon, CalendarFold, ShieldCheck, AlarmClock, MapPin } from 'lucide-react';
import useToken from "@/app/components/useToken";
import { Separator } from "@/components/ui/separator"

function parseStatus(status) {
  switch (status) {
    case 'active':
      return (
        <div className='flex justify-center items-center gap-x-2'>
          <h2 className='text-3xl font-normal tracking-tight'>Активен</h2>
          <ShieldCheck size={36} color="#37c84f" strokeWidth={1.5} />
        </div>
      )
    case 'pending':
      return (
        <div className='flex justify-center items-center gap-x-1'>
          <h2 className='text-3xl font-normal tracking-tight'>Выбор подрядчика</h2>
          <AlarmClock size={36} color="#4f4f4f" strokeWidth={1.5} />
        </div>)
  }
}

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
  if (diff < 0) {
    return "0"
  }
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
    select: response => response?.data?.data as ITenderDetails & { files: { id: string, tenderId: string, url: string, name: string; }[] },
  });


  const { data: tenderCategory, isFetching: isCategoryFetching, isError: isCategoryError } = useQuery({
    queryKey: ['category'],
    queryFn: () => httpClient.getCategoryById(tenderDetails.categoryId),
    select: response => response?.data?.data as Category
  });

  const { data: tenderRegion, isFetching: isRegionFetching, isError: isRegionError } = useQuery({
    queryKey: ['region'],
    queryFn: () => httpClient.getRegionById(tenderDetails.categoryId),
    select: response => response?.data?.data as Region
  });

  const { data: hasBid, isFetching: isHasBidFetching, isError: isHasBidErrors } = useQuery({
    queryKey: ['hasBid'],
    queryFn: () => httpClient.getHasBid(currentTenderId),
    select: response => response?.data as boolean,
  });

  const { isFetching: isTokenFetching, authToken } = useToken();
  if (isTokenFetching) return;
  if (!authToken) {
    // if user is not authenticated
    router.push("/login");
    return;
  }



  return (
    <div className="container flex flex-col mt-10 ">
      <div className="flex-1 flex-col space-y-4 px-8 pt-6  bg-stone-100 drop-shadow-xl  rounded-xl border-2 mb-5">
        <div className="flex items-center justify-between space-y-2  px-2 py-6">
          {isUserFetching || isFetching || !tenderDetails || isCategoryFetching || !tenderCategory ? (
            <Skeleton className="h-24 w-full rounded-md" />
          ) : (
            <>
              <h2 className="text-3xl font-bold tracking-tight">Карточка тендера</h2>
              <h2 className="flex text-3xl font-bold tracking-tight">
                {parseStatus(tenderDetails.status)}
              </h2>
            </>
          )}
        </div>
        <Separator />

        {isUserFetching || isFetching || !tenderDetails || isCategoryFetching || !tenderCategory || isRegionFetching || !tenderRegion ? (
          <Skeleton className="h-24 w-full rounded-md" />
        ) : 
        (<div className='text-3xl font-medium tracking-tight px-2 py-3 w-fit'>
        {tenderDetails.name}
        </div>)}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            {isUserFetching || isFetching || !tenderDetails || isCategoryFetching || !tenderCategory || isRegionFetching || !tenderRegion ? (
              <Skeleton className="h-24 w-full rounded-md" />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 grid-cols-3">
                  <Card className='border-0 drop-shadow-md'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Начальная цена
                      </CardTitle>
                      <RussianRuble size={23} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₽ {(tenderDetails.start_price).toLocaleString('ru')}</div>
                    </CardContent>
                  </Card>
                  <Card className='border-0 drop-shadow-md'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Категория тендера
                      </CardTitle>
                      <FolderIcon size={23} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{tenderCategory.name}</div>
                    </CardContent>
                  </Card>
                  <Card className='border-0 drop-shadow-md'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Регион
                      </CardTitle>
                      <MapPin color="#ff4d4d" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">{tenderRegion.name}</div>
                      <p className="text-xs text-muted-foreground pt-1">
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 grid-cols-3 md:grid-cols-3 lg:grid-cols-3 sm:grid-cols-1 min-h-40">
                  <Card className='col-span-2  border-0 drop-shadow-md'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        Описание тендера
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='h-24 overflow-y-auto pt-4 pb-1 pl-6 pr-2'>
                      <div className='text-xl font-medium break-words'>
                        {tenderDetails.description}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1 border-0 drop-shadow-md'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Создан:
                      </CardTitle>
                      <CalendarFold size={23} />
                    </CardHeader>
                    <CardContent className='pb-6'>
                      <div className="text-2xl font-bold">{new Date(tenderDetails.createdAt).toLocaleDateString()}</div>
                      <p className="text-xs text-muted-foreground pt-4">
                        До окончания: {getRemainingTime(tenderDetails.untilDate)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
        {isUserFetching || isFetching || !tenderDetails || isCategoryFetching || !tenderCategory ? (
          <Skeleton className="h-24 w-full rounded-md" />
        ) : (
          <div className='flex pb-5 justify-between items-center'>
            <ActionList tenderId={currentTenderId} userRole={userDetails?.role} isBidded={hasBid}
              isCreator={tenderDetails.customerId === userDetails?.id} filesList={tenderDetails.files} defaultValues={{ name: tenderDetails.name, description: tenderDetails.description, start_price: tenderDetails.start_price.toString(), category_id: tenderDetails.categoryId, region_id: tenderDetails.regionId, until_date: tenderDetails.untilDate }}/>
          </div>)}
      </div>
    </div>
  )
}


{/* <p>Создан:<br></br> {new Date(createdAt).toLocaleDateString()}</p>
<p>До окончания:<br></br> {getRemainingTime(untilDate)}</p> */
}
