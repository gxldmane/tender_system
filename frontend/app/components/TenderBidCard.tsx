import React from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ISendedBid, ITenderDetails } from "@/app/http/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { ArrowRight, Ellipsis } from "lucide-react";

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

const handleRowClick = (id: number) => {
  const router = useRouter()
  router.push(`/view-more?tenderId=${id}`)
}

export default function TenderBidCard({ items, ...props }: TenderCardProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">№</TableHead>
          <TableHead className="text-center">Тендер</TableHead>
          <TableHead className="text-center">Компания</TableHead>
          <TableHead className="text-center">Цена</TableHead>
          <TableHead className="text-center">
            Статус
          </TableHead>
          <TableHead className="text-center">
            Дата подачи
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index} className='cursor-pointer'>
            <TableCell className="font-medium text-muted-foreground text-center">
              {index + 1}
            </TableCell>
            <TableCell className="font-medium text-center max-w-52 truncate">
              {item.tenderName}
            </TableCell>
            <TableCell className="font-medium text-center">
              {item.tenderCompanyName}
            </TableCell>
            <TableCell className="font-medium text-center">
              {item.price}
            </TableCell>
            <TableCell className="font-medium text-center pl-5">
              {fetchStatus(item.status)}
            </TableCell>
            <TableCell className="font-medium text-center">
              {new Date(item.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-center">
              <Link href={`/view-more?tenderId=${item.tenderId}`}>
                <Button variant="ghost" size='icon'>
                <ArrowRight />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))
        }
      </TableBody>
    </Table>
  );
}