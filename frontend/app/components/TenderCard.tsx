import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TenderCardProps {
  items: {
    id: number; // Уникальный идентификатор
    name: string;
    description: string; // Описание тендера
    start_price: number; // Начальная цена
    currentPrice: number; // Текущая цена (опционально)
    categoryId: number; // Идентификатор категории
    customerId: number; // Идентификатор заказчика
    executorId: number; // Идентификатор исполнителя (опционально)
    untilDate: string; // Дата окончания тендера
    createdAt: string; // Дата создания тендера
    updatedAt: string; // Дата обновления тендера
  }[]
}

export default function TenderCard({ items, ...props }: TenderCardProps) {
  const [tenderId, setTenderId] = useState<number | null>(null);

  const handleClick = (item) => {
    setTenderId(item.id);
  };
  return (
    <>
      {items.map((item) => (
        <div className="flex justify-between items-center pb-4" key={item.id}> {/* Use item.id for unique keys */}
          <div>
            <p>Название: {item.name}</p>
            <p>Установленная цена: {item.start_price}₽</p>
          </div>
          <Button>
            <Link href={`/view-more?tenderId=${item.id}`}>
              <Button>
                Дополнительно
              </Button>
            </Link>
          </Button>
        </div>
      ))}
    </>
  );
}