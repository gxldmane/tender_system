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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ICategoriesResponse, ICompaniesResponse, IRegionsResponse, ITendersResponse } from "@/app/http/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import useToken from "@/app/components/useToken";

export default function Browse() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { data: response, isFetching, isError } = useQuery({
    queryKey: ['tenders'],
    queryFn: () => httpClient.getAllTenders(currentPage),
    select: data => data?.data as ITendersResponse,
  });


  const { isFetching: isTokenFetching, authToken } = useToken();
  if (isTokenFetching) return;
  if (!authToken) {
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



  return (
      <div className="container px-4 grid gap-6 px-6 w-full py-12 md:py-16 lg:py-20">
        {!isFetching &&
          <div className="grid gap-2">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Тендеры {response.meta.from}-{response.meta.to} из {response.meta.total}</h3>
            <p className="text-gray-500 dark:text-gray-400">Ознакомьтесь со списком активных тендеров.</p>
          </div>}
          {isFetching || !response ? (
            <Skeleton className="h-24 w-full rounded-md" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <TendersCard items={response.data} />
            </div>
          )}
        <div className="my-6">
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
  );
}