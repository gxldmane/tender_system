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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react";

export default function DashboardPage(props) {
  const { userDetails, isFetching, invalidateUserData } = useUser();
  const router = useRouter();
  const { data: companies, isFetching: isCompaniesFetching, isError } = useQuery({
    queryKey: ['companies'],
    queryFn: () => httpClient.getCompanies(),
    select: data => data?.data?.data,
  });
  const { isFetching: isTokenFetching, authToken, invalidateToken } = useToken();

  if (isTokenFetching || isCompaniesFetching || isFetching) return <Skeleton className="h-24 w-full rounded-md" />;

  if (!authToken) {
    // if user is not authenticated
    router.push("/login");
    return;
  }

  const handleSignOut = async () => {
    invalidateUserData();
    invalidateToken();
    router.push("/");
    location.reload();
  }

  return (
    <div className="relative left-13">
      <div className="border-2 rounded-md px-7 border-gray-300 py-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Профиль</h3>
        </div>
        <Separator />
        <div className="w-full space-y-5">
          <div>
            <h3 className="text-lg font-medium pb-2">Имя</h3>
            <p className="px-3 py-2 border-2 text-m ring-offset-background my-0 w-full rounded-md border break-words">{userDetails.name.toUpperCase()}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium pb-2">E-mail</h3>
            <p className="px-3 py-2 border-2 text-m ring-offset-background my-0 w-full rounded-md border break-words">{userDetails.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium pb-2">Роль</h3>
            <p className="px-3 py-2 border-2 text-m ring-offset-background my-0 w-full rounded-md border break-words">{userDetails.role === 'executor' ? 'Подрядчик' : userDetails.role === 'customer' ? 'Заказчик' : ''}</p>
          </div>
          <div>
            <div>
              <div className="flex items-center gap-x-1">
                <h3 className="text-lg font-medium">Компания</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild >
                      <InfoIcon className="h-4 cursor-pointer"></InfoIcon>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="end" alignOffset={100} >
                      <p className="max-w-96 px-3 py-2 text-m break-words">{companies.find(c => c.id == userDetails.companyId).description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="px-3 py-2 border-2 text-m ring-offset-background my-0 w-full rounded-md border break-words">{companies.find(c => c.id == userDetails.companyId).name}</p>
            </div>
          </div>
        </div>
        <Button className='min-w-36' variant={"destructive"} onClick={handleSignOut}>Выйти из аккаунта</Button>
      </div>
    </div>

  )
} 