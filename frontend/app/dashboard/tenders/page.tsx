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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import useUser from "@/app/components/useUser";

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

  const { userDetails } = useUser();
  const { isFetching: isTokenFetching, authToken } = useToken();
  if (isTokenFetching) return;
  if (!authToken) {
    // if user is not authenticated
    router.push("/login");
    return;
  }
  if (userDetails.role !== 'customer') {
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

  if (!isFetching && response.data.length <= 0) {
    return <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className='min-w-36' variant={"default"}>
            <CirclePlus className="mr-2 h-4 w-4" />
            Создать новый
          </Button>
        </SheetTrigger>
        <SheetContent className={"p-8 min-w-fit overflow-y-scroll"}>
          <SheetHeader>
            <SheetTitle>Создание нового тендера</SheetTitle>
          </SheetHeader>
          <TenderCreate update={false} />
        </SheetContent>
      </Sheet>
    </div>
  }

  return (
    <section className="w-full px-5 py-2">
      <div className="container mx-auto grid gap-6 md:px-6">
        {!isFetching &&
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold tracking-tight md:text-2xl">Мои Тендеры {response.meta.from}-{response.meta.to} из {response.meta.total}</h3>
            <p className="text-gray-500 dark:text-gray-400">Отслеживайте свои тендеры здесь</p>
          </div>
          <Dialog>
          <DialogTrigger asChild>
            <Button className='min-w-36' variant={"default"}>
              <CirclePlus className="mr-2 h-4 w-4" />
              Создать новый
            </Button>
          </DialogTrigger>
          <DialogContent className={"p-8 min-w-fit h-screen"}>
            <DialogHeader>
              <DialogTitle>Создание нового тендера</DialogTitle>
            </DialogHeader>
            <ScrollArea>
              <TenderCreate update={false} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
        </div>}
        <div className="grid gap-4 md:grid-cols-2">
          {isFetching || !response ? (
            <Skeleton className="h-24 w-full rounded-md" />
          ) : (
            <>
              <TendersCard items={response.data} />
            </>
          )}
        </div>
        <div className="mt-6 mb-6">
          <Pagination>
            {!isFetching && <PaginationContent>
              <PaginationItem>
                <PaginationPrevious className={cn(!response.links.prev && "invisible")}
                  href={createPageURL(currentPage - 1)} />
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
                  href={createPageURL(currentPage + 1)} />
              </PaginationItem>
            </PaginationContent>
            }
          </Pagination>
        </div>
      </div>
    </section>
  );
}