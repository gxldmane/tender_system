import React from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ISendedBid, ITenderDetails } from "@/app/http/types";

interface TenderCardProps {
  items: ISendedBid[];
}

export default function TenderBidCard({ items, ...props }: TenderCardProps) {
  return (
    <>
      {items.map((item) => (
        <div className="flex justify-between items-center pb-4" key={item.id}> {/* Use item.id for unique keys */}
          <div>
            <p>Айди тендера: {item.tenderId}</p>
            <p>Предложенная цена: {item.price}₽</p>
          </div>
          <Button>
            <Link href={`/view-more?tenderId=${item.tenderId}`}>
              Дополнительно
            </Link>
          </Button>
        </div>
      ))}
    </>
  );
}