import React from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ITenderDetails } from "@/app/http/types";

interface TenderCardProps {
  items: ITenderDetails[];
}

export default function TendersCard({ items, ...props }: TenderCardProps) {
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