import React from "react"

import { CardContent, Card } from "@/components/ui/card"
import Link from "next/link"
import { Category, ICategoriesResponse, IRegionsResponse, ITenderDetails, Region } from "@/app/http/types";
import { FolderIcon, MapPinIcon, RussianRuble, TagIcon } from "lucide-react";
import httpClient from "../http";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

function findCategoryName(categories: Category[], id: number) {
  return categories.find((category) => category.id === id)?.name;
}

function findRegionName(regions: Region[], id: number) {
  return regions.find((region) => region.id === id)?.name;
}

interface TenderCardProps {
  items: ITenderDetails[];
}

export default function TendersCard({ items, ...props }: TenderCardProps) {
  const { data: categoriesResponse, isFetching: isCategoriesFetching, isError: isCategoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => httpClient.getCategories(),
    select: data => data?.data as ICategoriesResponse,
  });

  const { data: regionsResponse, isFetching: isRegionsFetching, isError: isRegionsError } = useQuery({
    queryKey: ['regions'],
    queryFn: () => httpClient.getRegions(),
    select: data => data?.data as IRegionsResponse,
  })

  if (isCategoriesFetching || isRegionsFetching) {
    return <div></div>;
  }

  return (
    <>
      {items.map((item) => (
        <Link className="group" href={`/view-more?tenderId=${item.id}`} key={item.id}>
          <Card className="h-full transition-transform duration-300 ease-in-out group-hover:-translate-y-1">
            <CardContent className="grid gap-4 pt-6">
              <div className="grid gap-1">
                <h3 className="text-lg font-medium min-h-14 line-clamp-2">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{findRegionName(regionsResponse?.data, item.regionId)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <FolderIcon className="h-4 w-4" />
                  <span>{findCategoryName(categoriesResponse?.data, item.categoryId)}</span>
                </div>
                <Badge variant={item.status == 'active' ? "success" : (item.status == 'pending' ? "outline" : "destructive")}>{item.status == "active" ? "Активен" : (item.status == "pending" ? "Ожидание" : "Закрыт")}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <TagIcon className="h-4 w-4" />
                  <span>{item.id}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold">
                  <span>{item.start_price.toLocaleString('ru')}</span>
                  <RussianRuble strokeWidth={2.25} className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Подача заявок {item.status === 'active' ? "до " + item.untilDate.toLocaleString() : "окончена"}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))
      }
    </>
  );
}