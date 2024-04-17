"use client"


import React from "react"
import { Button } from "@/components/ui/button";
import useUser from "@/app/components/useUser";
import { useRouter } from "next/navigation";
import useToken from "@/app/components/useToken";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import httpClient from "@/app/http";

export default function DashboardPage(props) {
  const { userDetails, isFetching, invalidateUserData } = useUser();
  const router = useRouter();
  const { data: companies, isFetching: isCompaniesFetching, isError } = useQuery({
    queryKey: ['companies'],
    queryFn: () => httpClient.getCompanies(),
    select: data => data?.data?.data,
  });
  const { isFetching: isTokenFetching, authToken, invalidateToken } = useToken();

  if (isTokenFetching || isCompaniesFetching || isFetching) return <Skeleton className="h-24 w-full rounded-md"/>;

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
    <>
      <Button className='min-w-36' variant={"destructive"} onClick={handleSignOut}>Выйти из аккаунта</Button>
    </>
  )
} 