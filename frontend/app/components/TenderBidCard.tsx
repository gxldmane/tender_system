import React from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ISendedBid, ITenderDetails } from "@/app/http/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface TenderCardProps {
  items: ISendedBid[];
}

const fetchStatus = (status: string) => {
  switch (status) {
    case "accepted":
      return (<Badge variant="success" className="align-center">Принята</Badge>);
    case "pending":
      return (<Badge variant="outline" className="align-center">Ожидание</Badge>);
    case "rejected":
      return (<Badge variant="destructive" className="align-center">Отклонена</Badge>)
  }
}

export default function TenderBidCard({ items, ...props }: TenderCardProps) {
  return (
    <>
      {/*{items.map((item) => (*/}
      {/*  <div className="flex justify-between items-center pb-4" key={item.id}> /!* Use item.id for unique keys *!/*/}
      {/*    <div>*/}
      {/*      <p>Айди тендера: {item.tenderId}</p>*/}
      {/*      <p>Предложенная цена: {item.price}₽</p>*/}
      {/*    </div>*/}
      {/*    <Button>*/}
      {/*      <Link href={`/view-more?tenderId=${item.tenderId}`}>*/}
      {/*        Дополнительно*/}
      {/*      </Link>*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*))}*/}
      {items.map((item) => (
        <div className="grid gap-4 grid-cols-4 min-h-40 bg-white drop-shadow rounded-xl h-full border-0 p-7 mb-5" key={item.id}>
          <div className="col-span-2 flex flex-col flex-grow gap-y-6">
            <h1 className="text-base font-bold">{item.tenderName}</h1>
            <div className="flex flex-col gap-y-2">
              <h2 className="text-base text-sm">{ "Заказчик: " + item.tenderCustomerName}</h2>
              <h3 className="text-xs text-muted-foreground font-light">{"Компания: " + item.tenderCompanyName}</h3>
            </div>
          </div>
          <div className="col-span-1 flex flex-col flex-grow justify-between">
            <h1>
              {(item.price).toLocaleString('ru')} ₽
            </h1>
          </div>
          <div className="flex flex-col items-end justify-between">
            <div>
              {fetchStatus(item.status)}
            </div>
            <Button asChild className="flex gap-x-1" variant="outline">
              <div>
                <Link href={`/view-more?tenderId=${item.tenderId}`}>
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