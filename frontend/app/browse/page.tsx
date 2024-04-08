"use client"
import React from 'react';
import TendersCard from '../components/TendersCard';
import { useQuery } from '@tanstack/react-query';
import httpClient from '../http';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { ITendersResponse } from "@/app/http/types";
import { cn } from "@/lib/utils";

export default function Browse() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data: response, isFetching, isError } = useQuery({
    queryKey: ['tenders'],
    queryFn: () => httpClient.getAllTenders(currentPage),
    select: data => data?.data as ITendersResponse,
  });

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const createPageNumbers = (maxPages: number) => {
    return Array.from({ length: maxPages }, (_, i) => i + 1);
  };

  return (
    <div className="container">
      {!isFetching &&
          <h3 className="text-2xl font-semibold leading-none tracking-tight mx-auto flex w-full justify-center p-4">Тендеры {response.meta.from}-{response.meta.to} из {response.meta.total}</h3>}
      <div className="container mx-auto md:w-1/2 space-y-6 p-10 bg-white border-2 rounded-md ">
        {isFetching || !response ? (
          <Skeleton className="h-24 w-full rounded-md"/>
        ) : (
          <div>
            <TendersCard items={response.data}/>
          </div>
        )}
      </div>
      <div className="pt-6">
        <Pagination>
          {!isFetching && <PaginationContent>
              <PaginationItem>
                  <PaginationPrevious className={cn(!response.links.prev && "invisible")}
                                      href={createPageURL(currentPage - 1)}/>
              </PaginationItem>
            {
              createPageNumbers(response.meta.last_page).map(
                page => (
                  <PaginationItem>
                    <PaginationLink isActive={page === currentPage}
                                    href={createPageURL(page)}>{page}</PaginationLink>
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