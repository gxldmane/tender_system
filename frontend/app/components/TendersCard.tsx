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

function generatePseudoRandomString(seed) {
  // Создаем объект для генерации псевдо-случайных чисел
  const seedRandom = mulberry32(seed);

  // Функция для генерации случайных символов из заданного набора
  const getRandomChar = () => allowedChars[Math.floor(seedRandom() * allowedChars.length)];

  // Допустимые символы
  const allowedChars = 'ABCEHKMOPTX0123456789';

  // Генерируем первую часть строки (8 символов)
  let result = Array.from({ length: 4 }, getRandomChar).join('');

  // Добавляем seed
  result += `-${seed}-`;

  // Генерируем последнюю часть строки (6 символов)
  result += Array.from({ length: 4 }, getRandomChar).join('');

  return result;
}

// Вспомогательная функция для генерации псевдо-случайных чисел
function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
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
    return <div>Loading...</div>;
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
                  <span>{generatePseudoRandomString(item.id)}</span>
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
// <div className="grid gap-4 grid-cols-4 min-h-40 bg-white drop-shadow rounded-xl h-full border-0 p-7 mb-5" key={item.id}>
//   <div className="col-span-2 flex flex-col flex-grow gap-y-6">
//     <h1 className="text-base font-bold">{item.name}</h1>
//     <div className="flex flex-col gap-y-2">
//       <h2 className="text-base text-sm">{findCategoryName(categoriesResponse?.data, item.categoryId)}</h2>
//       <h3 className="text-xs text-muted-foreground font-light">Тендер {generatePseudoRandomString(item.id)}</h3>
//     </div>
//   </div>
//   <div className="col-span-1 flex flex-col flex-grow justify-between">
//     <h1>
//       {(item.start_price).toLocaleString('ru')} ₽
//     </h1>
//     {item.status === 'active' &&
//       <div className="flex flex-col">
//         <h2 className="text-base text-sm">Подача заявок</h2>
//         <h3 className="text-base">до {item.untilDate.toLocaleString()}</h3>
//       </div>
//     }
//   </div>
//   <div className="flex flex-col items-end justify-between">
//     <div>
//       {parseStatus(item.status)}
//     </div>
//     <Button asChild className="flex gap-x-1" variant="outline">
//       <div>
//         <Link href={`/view-more?tenderId=${item.id}`}>
//           Доп. информация
//         </Link>
//       </div>
//     </Button>
//   </div>
// </div >