import React from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Category, ICategoriesResponse, IRegionsResponse, ITenderDetails, Region } from "@/app/http/types";
import { AlarmClock, CircleX, Info, ShieldCheck } from "lucide-react";
import httpClient from "../http";
import { useQuery } from "@tanstack/react-query";

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
  let result = Array.from({ length: 8 }, getRandomChar).join('');

  // Добавляем seed
  result += `-${seed}-`;

  // Генерируем последнюю часть строки (6 символов)
  result += Array.from({ length: 6 }, getRandomChar).join('');

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

function parseStatus(status) {
  switch (status) {
    case 'active':
      return (
        <div className='flex justify-center items-center gap-x-2'>
          <h2 className='font-normal tracking-tight'>Активен</h2>
          <ShieldCheck color="#37c84f" />
        </div>
      )
    case 'pending':
      return (
        <div className='flex justify-center items-center gap-x-1'>
          <h2 className='font-normal tracking-tight'>Выбор подрядчика</h2>
          <AlarmClock color="#4f4f4f" />
        </div>)
    case 'closed':
      return (
        <div className='flex justify-center items-center gap-x-1'>
          <h2 className='font-normal tracking-tight'>Тендер закрыт</h2>
          <CircleX color="#ff0000" />
        </div>)
  }
}


interface TenderCardProps {
  items: ITenderDetails[];
}

export default function TendersCard({ items, ...props }: TenderCardProps) {
  const {data: categoriesResponse, isFetching: isCategoriesFetching, isError: isCategoriesError} = useQuery({
    queryKey: ['categories'],
    queryFn: () => httpClient.getCategories(),
    select: data => data?.data as ICategoriesResponse,
  });

  if (isCategoriesFetching) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {items.map((item) => (
        <div className="grid gap-4 grid-cols-4 min-h-40 bg-white drop-shadow rounded-xl h-full border-0 p-7 mb-5" key={item.id}>
          <div className="col-span-2 flex flex-col flex-grow gap-y-6">
            <h1 className="text-base font-bold">{item.name}</h1>
            <div className="flex flex-col gap-y-2">
              <h2 className="text-base text-sm">{findCategoryName(categoriesResponse?.data, item.categoryId)}</h2>
              <h3 className="text-xs text-muted-foreground font-light">Тендер {generatePseudoRandomString(item.id)}</h3>
            </div>
          </div>
          <div className="col-span-1 flex flex-col flex-grow justify-between">
            <h1>
              {(item.start_price).toLocaleString('ru')} ₽
            </h1>
            {item.status === 'active' &&
              <div className="flex flex-col">
                <h2 className="text-base text-sm">Подача заявок</h2>
                <h3 className="text-base">до {item.untilDate.toLocaleString()}</h3>
              </div>
            }
          </div>
          <div className="flex flex-col items-end justify-between">
            <div>
              {parseStatus(item.status)}
            </div>
            <Button asChild className="flex gap-x-1" variant="outline">
              <div>
                <Link href={`/view-more?tenderId=${item.id}`}>
                  Доп. информация
                </Link>
              </div>
            </Button>
          </div>
        </div >
      ))
      }
    </>
  );
}