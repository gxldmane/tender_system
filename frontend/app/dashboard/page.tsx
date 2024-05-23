"use client"


import React from "react"
import { Button } from "@/components/ui/button";
import useUser from "@/app/components/useUser";
import { useRouter } from "next/navigation";
import useToken from "@/app/components/useToken";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import httpClient from "@/app/http";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { Mail, Building2, InfoIcon, KeyRound } from "lucide-react";
import useNotifications from "../components/useNotifications";

export default function DashboardPage(props) {
  const { userDetails, isFetching, invalidateUserData } = useUser();
  const { invalidateNotificationsData } = useNotifications();
  const router = useRouter();
  const { data: companies, isFetching: isCompaniesFetching, isError } = useQuery({
    queryKey: ['companies'],
    queryFn: () => httpClient.getCompanies(),
    select: data => data?.data?.data,
  });
  const { isFetching: isTokenFetching, authToken, invalidateToken } = useToken();

  if (isTokenFetching || isCompaniesFetching || isFetching) return <Skeleton className="h-24 w-full rounded-md" />;

  if (!authToken) {
    router.push("/login");
    return;
  }

  const handleSignOut = async () => {
    invalidateUserData();
    invalidateToken();
    invalidateNotificationsData();
    router.push("/");
    location.reload();
  }

  const nameWords = userDetails.name.split(' ');
  const firstInitials = nameWords.slice(0, 2).map(word => word.charAt(0).toUpperCase());

  return (
    <div className="relative left-13">
      <div className="bg-white rounded-md px-7 py-6 space-y-6 drop-shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-semibold">
            {userDetails.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
          </h3>
          <span className="w-16 h-16 rounded-full bg-gray-300 border-2 border-neutral-200 text-white text-center font-normal text-2xl flex items-center justify-center">

            {
              userDetails.name.split(' ').length === 1
                ?
                (userDetails.name.charAt(0).toUpperCase())
                :
                (userDetails.name.split(' ').slice(0, 2).map(word => word.charAt(0).toUpperCase()).join(''))
            }
          </span>
        </div>
        {/* <Separator className="mt-1" /> */}
        <div className="w-full space-y-5">
          <div>
            <div className="flex gap-x-2">
              <Mail />
              <h3 className="text-xl font-medium pb-2">E-mail</h3>
            </div>
            <p
              className="px-3 py-2 border-2 text-m ring-offset-background my-0 w-full rounded-md border break-words">{userDetails.email}
            </p>
          </div>
          <div>
            <div className="flex gap-x-2">
              <KeyRound />
              <h3 className="text-xl font-medium pb-2">Роль</h3>
            </div>
            <p
              className="px-3 py-2 border-2 text-m ring-offset-background my-0 w-full rounded-md border break-words">{userDetails.role === 'executor' ? 'Подрядчик' : userDetails.role === 'customer' ? 'Заказчик' : ''}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-1">
              <div className="flex gap-x-2">
                <Building2 />
                <h3 className="text-xl font-medium">Компания</h3>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 cursor-pointer"></InfoIcon>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="end" alignOffset={100}>{
                    !isCompaniesFetching &&
                    <p
                      className="max-w-96 px-3 py-2 text-m break-words">{companies.find(c => c.id == userDetails.companyId).description}</p>
                  }</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p
              className="px-3 py-2 border-2 text-m ring-offset-background my-0 w-full rounded-md border break-words">{companies.find(c => c.id == userDetails.companyId).name}</p>
          </div>
        </div>
        <Button className='min-w-36' variant={"destructive"} onClick={handleSignOut}>Выйти из аккаунта</Button>
      </div>
    </div>
  )
} 