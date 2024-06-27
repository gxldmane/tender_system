"use client"
import React, { useEffect, useState } from 'react';
import TendersCard from '../components/TendersCard';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ICategoriesResponse, IRegionsResponse, ITendersResponse } from "@/app/http/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import useToken from "@/app/components/useToken";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ListOrderedIcon } from 'lucide-react';

export default function Browse() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { isFetching: isTokenFetching, authToken } = useToken();

  const initialState = {
    sort: searchParams.get('sort') || 'created_at',
    sortOrder: searchParams.get('order') || 'asc',
    filterCategories: searchParams.getAll('filter[category_id]'),
    filterRegions: searchParams.getAll('filter[region_id]'),
  };

  const [filters, setFilters] = useState(initialState);

  const { data: response, isLoading: isTendersLoading } = useQuery({
    queryKey: ['tenders', currentPage, filters],
    queryFn: () => httpClient.getAllTenders(currentPage, {
      sort: `${filters.sortOrder === 'desc' ? '-' : ''}${filters.sort}`,
      'filter[category_id]': filters.filterCategories,
      'filter[region_id]': filters.filterRegions,
    }),
    select: data => data?.data as ITendersResponse,
    placeholderData: keepPreviousData // если новые тендеры пока загружаются, оставить предыдущие
  });

  const { data: categoriesResponse, isLoading: isCategoriesFetching } = useQuery({
    queryKey: ['categories'],
    queryFn: () => httpClient.getCategories(),
    select: data => data?.data as ICategoriesResponse,
  });

  const { data: regionsResponse, isLoading: isRegionsFetching } = useQuery({
    queryKey: ['regions'],
    queryFn: () => httpClient.getRegions(),
    select: data => data?.data as IRegionsResponse,
  });

  useEffect(() => {
    if (isTokenFetching) return;
    if (!authToken) {
      router.push("/login");
      return;
    }
  }, [isTokenFetching, authToken, router]);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    params.set('sort', filters.sort);
    params.set('order', filters.sortOrder);

    // Clear existing filter parameters
    params.delete('filter[category_id]');
    params.delete('filter[region_id]');

    // Add new filter parameters
    filters.filterCategories.forEach(categoryId => {
      params.append('filter[category_id]', categoryId);
    });

    filters.filterRegions.forEach(regionId => {
      params.append('filter[region_id]', regionId);
    });

    return `${pathname}?${params.toString()}`;
  };

  const createPageNumbers = (maxPages: number) => {
    return Array.from({ length: maxPages }, (_, i) => i + 1);
  };

  const [openCategories, setOpenCategories] = useState(false)
  const [openRegions, setOpenRegions] = useState(false)
  const handleClickCategories = () => {
    setOpenCategories(!openCategories)
  }
  const handleClickRegions = () => {
    setOpenRegions(!openRegions)
  }

  const handleRemoveFilters = () => {
    setFilters((prevState) => {
      Object.keys(prevState).forEach(key => {
        if (Array.isArray(prevState[key])) {
          prevState[key] = [];
        }
      });
      return { ...prevState };
    })
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => {
      const filterValues = new Set(prev[filterType]);
      if (filterValues.has(value)) {
        filterValues.delete(value);
      } else {
        filterValues.add(value);
      }
      return {
        ...prev,
        [filterType]: Array.from(filterValues),
      };
    });
  };

  const handleSortChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    router.replace(createPageURL(1));
  }, [filters, router]);

  if (isTokenFetching || !authToken) return null;

  return (
    <div className="container flex flex-col flex-grow gap-6 px-4 py-12 md:py-16 lg:py-20">
      <div>

        <div className="grid gap-2">
          <div className="flex justify-between">
            <h3
              className="text-2xl font-bold tracking-tight md:text-3xl">{!isTendersLoading && response.data.length != 0 ? `Тендеры ${response?.meta?.from ?? 0}-${response?.meta?.to ?? 0} из ${response?.meta?.total ?? 0}` : "Тендеры"}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ListOrderedIcon className="w-4 h-4"/>
                  Сортировка
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={filters.sort}
                  onValueChange={(value) => handleSortChange('sort', value)}
                >
                  <DropdownMenuRadioItem value="created_at">Дата создания</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="until_date">Дата окончания</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="start_price">Цена</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup
                  value={filters.sortOrder}
                  onValueChange={(value) => handleSortChange('sortOrder', value)}
                >
                  <DropdownMenuRadioItem value="asc">По возрастанию</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">По убыванию</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Ознакомьтесь со списком активных тендеров.</p>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-1/4 flex flex-col gap-4">
          <div className='flex flex-col'>
            <div>
              <Button variant='link' className='p-0 w-full flex justify-between h-7' onClick={handleClickCategories}>
                <h4>Категории</h4>
                {openCategories
                  ?
                  <ChevronUp color="#393838" strokeWidth={1.25} className='h-8'/>
                  :
                  <ChevronDown color="#393838" strokeWidth={1.25} className='h-8'/>
                }
              </Button>
              <div
                className={`transition-all duration-300 ${openCategories ? 'max-h-48 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-y-hidden'
                }`}
              >
                {!isCategoriesFetching && categoriesResponse.data.map(category => (
                  <div key={category.id} className='flex gap-2 items-center'>
                    <Checkbox
                      checked={filters.filterCategories.includes(category.id.toString())}
                      onCheckedChange={() => handleFilterChange('filterCategories', category.id.toString())}
                    />
                    <label>{category.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Button variant='link' className='p-0 w-full flex justify-between' onClick={handleClickRegions}>
                <h4>Регионы</h4>
                {openRegions
                  ?
                  <ChevronUp color="#393838" strokeWidth={1.25} className='h-8'/>
                  :
                  <ChevronDown color="#393838" strokeWidth={1.25} className='h-8'/>
                }
              </Button>
              <div
                className={`transition-all duration-300 ${openRegions ? 'max-h-48 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-y-hidden'
                }`}
              >
                {!isRegionsFetching && regionsResponse.data.map(region => (
                  <div key={region.id} className='flex gap-2 items-center'>
                    <Checkbox
                      checked={filters.filterRegions.includes(region.id.toString())}
                      onCheckedChange={() => handleFilterChange('filterRegions', region.id.toString())}
                    />
                    <label>{region.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Button variant='link' className='p-0 w-full flex justify-between text-red-700'
                      onClick={handleRemoveFilters}>
                Очистить фильтры
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          {isTendersLoading || !response ? (
            <Skeleton className="h-24 w-full rounded-md"/>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <TendersCard items={response.data}/>
            </div>
          )}

          <div className="flex justify-end grow mt-4">
            <Pagination className='mt-auto'>
              {!isTendersLoading && <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious className={cn(!response.links.prev && "invisible")}
                                      href={createPageURL(currentPage - 1)}/>
                </PaginationItem>
                {createPageNumbers(response.meta.last_page).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink href={createPageURL(page)} isActive={page === currentPage}>{page}</PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext className={cn(!response.links.next && "invisible")}
                                  href={createPageURL(currentPage + 1)}/>
                </PaginationItem>
              </PaginationContent>}
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}