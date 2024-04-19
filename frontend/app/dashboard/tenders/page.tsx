"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import httpClient from "@/app/http";
import { ITendersResponse } from "@/app/http/types";
import useToken from "@/app/components/useToken";
import { Skeleton } from "@/components/ui/skeleton";
import TendersCard from "@/app/components/TendersCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import TenderCreate from "@/app/components/TenderCreate";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function MyTenders() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { data: response, isFetching, isError } = useQuery({
    queryKey: ['tenders'],
    queryFn: () => httpClient.getMyTenders(currentPage),
    select: data => data?.data as ITendersResponse,
  });

  const { isFetching: isTokenFetching, authToken } = useToken();
  if (isTokenFetching) return;
  if (!authToken) {
    // if user is not authenticated
    router.push("/login");
    return;
  }

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    const href = `${pathname}?${params.toString()}`;
    return href;
  };

  const createPageNumbers = (maxPages: number) => {
    return Array.from({ length: maxPages }, (_, i) => i + 1);
  };

  if (!isFetching && response.data.length <= 0) {
    return <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='min-w-36' variant={"default"}>
            <CirclePlus className="mr-2 h-4 w-4"/>
            Создать новый
          </Button>
        </DialogTrigger>
        <DialogContent className={"p-8 min-w-fit"}>
          <DialogHeader>
            <DialogTitle>Создание нового тендера</DialogTitle>
          </DialogHeader>
          <TenderCreate/>
        </DialogContent>
      </Dialog>
    </div>
  }

  return (
    <div className={"flex flex-col justify-center items-center"}>
      {!isFetching &&
          <span className="text-2xl font-semibold mx-auto mb-4">Мои
          тендеры {response.meta.from ?? 0}-{response.meta.to ?? 0} из {response.meta.total}</span>
      }
      <div className="md:w-full space-y-6 p-10 bg-white border-2 rounded-md">
        {isFetching || !response ? (
          <Skeleton className="h-24 w-full rounded-md"/>
        ) : (
          <div>
            <TendersCard items={response.data}/>
          </div>
        )}
      </div>
      <div className="mt-6 mb-6">
        <Pagination>
          {!isFetching && <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className={cn(!response.links.prev && "invisible")}
                                  href={createPageURL(currentPage - 1)}/>
            </PaginationItem>
            {
              createPageNumbers(response.meta.last_page).map(
                page => (
                  <PaginationItem key={page}>
                    <PaginationLink href={createPageURL(page)} isActive={page === currentPage}>{page}</PaginationLink>
                  </PaginationItem>
                )
              )
            }
            <PaginationItem>
              <PaginationNext className={cn(!response.links.next && "invisible")}
                              href={createPageURL(currentPage + 1)}/>
            </PaginationItem>
          </PaginationContent>
          }
        </Pagination>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className='min-w-36' variant={"default"}>
            <CirclePlus className="mr-2 h-4 w-4"/>
            Создать новый
          </Button>
        </DialogTrigger>
        <DialogContent className={"p-8 min-w-fit"}>
          <DialogHeader>
            <DialogTitle>Создание нового тендера</DialogTitle>
          </DialogHeader>
          <TenderCreate/>
        </DialogContent>
      </Dialog>

    </div>
  );
}