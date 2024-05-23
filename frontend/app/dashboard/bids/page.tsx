"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import httpClient from "@/app/http";
import { ISendedBidsResponse, ITendersResponse } from "@/app/http/types";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import useUser from "@/app/components/useUser";
import TenderBidCard from "@/app/components/TenderBidCard";

export default function MyBids() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { data: response, isFetching, isError } = useQuery({
    queryKey: ['bids'],
    queryFn: () => httpClient.getMyBids(currentPage),
    select: data => data?.data as ISendedBidsResponse,
  });

  const { userDetails } = useUser();
  const { isFetching: isTokenFetching, authToken } = useToken();
  if (isTokenFetching) return;
  if (!authToken) {
    // if user is not authenticated
    router.push("/login");
    return;
  }
  if (userDetails.role !== 'executor') {
    router.push("/");
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

  if (isFetching || response.data?.length === 0) {
    return <div className="font-bold text-lg text-center">Вы не подали ни одной заявки</div>;
  }

  return (
    <div className={"flex flex-col justify-center items-center"}>
      {!isFetching &&
        <span className="text-2xl font-semibold mx-auto mb-4">Мои
          заявки {response.meta.from ?? 0}-{response.meta.to ?? 0} из {response.meta.total}</span>
      }
        {isFetching || !response ? (
          <Skeleton className="h-24 w-full rounded-md"/>
        ) : (
          <div>
            <TenderBidCard items={response.data}/>
          </div>
        )}
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
    </div>
  );
}