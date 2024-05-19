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

  const {data: categoriesResponse, isFetching: isCategoriesFetching, isError: isCategoriesError} = useQuery({
    queryKey: ['categories'],
    queryFn: () => httpClient.getCategories(),
    select: data => data?.data as ICategoriesResponse,
  });

  const {data: regionsResponse, isFetching: isRegionsFetching, isError: isRegionsError} = useQuery({
    queryKey: ['regions'],
    queryFn: () => httpClient.getRegions(),
    select: data => data?.data as IRegionsResponse,
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

  

  return (
    <div className='container'>
      {!isFetching &&
        <h3 className=" flex text-xl font-medium leading-none tracking-tight w-full p-4 pt-8">Тендеры {response.meta.from}-{response.meta.to} из {response.meta.total}</h3>}
      <div className="mx-auto px-4 ">
        {isFetching || !response ? (
          <Skeleton className="h-24 w-full rounded-md" />
        ) : (
          <div>
            <TendersCard items={response.data} categories={categoriesResponse?.data} regions={regionsResponse?.data}/>
          </div>
        )}
      </div>
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