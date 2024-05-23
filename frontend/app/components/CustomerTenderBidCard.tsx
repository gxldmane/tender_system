"use client"
import React, { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Company, ISendedBid} from "@/app/http/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "@/app/http";
import { IErrorResponse } from "../http/httpClient";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { SquareCheck } from "lucide-react";
import { useRouter } from "next/navigation";
interface TenderCardProps {
    items: ISendedBid[];
    status: string;
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

export default function CustomerTenderBidCard({ items, status, ...props }: TenderCardProps) {
    const queryClient = useQueryClient();
    async function getCompanyMap(): Promise<{ [key: number]: string }> {
        const companyMap: { [key: number]: string } = {};
        for (const item of items) {
            console.log("iteration")
            const companyId = item.companyId;
            const response = await queryClient.fetchQuery({
                queryKey: ['company'],
                queryFn: () => httpClient.getCompanyById(companyId),
            }).then<Company | IErrorResponse | any>(value => value?.data);
            console.log("responsik: " + JSON.stringify(response));
            if (response?.errors) {
                console.log("Ошибка");
                toast({
                    variant: "destructive",
                    title: "Что-то пошло не так",
                    description: response.message,
                });
                return;
            }
            const company = response.data;
            companyMap[companyId] = company.name;
        }

        return companyMap;
    }
    const handleYesClick = async (event, tenderId:number, bidId: number) => {
        const response = await queryClient.fetchQuery({
            queryKey: ['accept-bid'],
            queryFn: () => httpClient.acceptBid(tenderId, bidId),
          }).then<ISendedBid | IErrorResponse | any>(value => value?.data);
         
          console.log("status: " + response?.message)
          console.log(response?.message == "Tender is closed or active.")
          if (response?.errors || response?.message == "Tender is closed or active.") {
            console.log("Ошибка")
            toast({
              variant: "destructive",
              title: "Что-то пошло не так",
              description: response.message,
            });
            return;
          }
          toast({
            variant: "default",
            title: "Заявка успешно принята",
            description: "Статус тендера и статус остальных заявок обновлены",
          });
        //   router.push(`/view-more?tenderId=${tenderId}`);
          return;
    }

    const [companies, setCompanies] = useState<{ [key: number]: string } | null>(null)
    useEffect(() => {
        const fetchCompanies = async () => {
            const companyMap = await getCompanyMap();
            setCompanies(companyMap);
        };
        fetchCompanies();
    }, [items]);


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">№</TableHead>
                    <TableHead className="text-center">Компания</TableHead>
                    <TableHead className="text-center">Цена</TableHead>
                    <TableHead className="text-center">Статус</TableHead>
                    <TableHead className="hidden md:table-cell text-center">
                        Дата подачи
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item, index) => (
                    <>
                        <TableRow key={index}>
                            <TableCell className="font-medium text-muted-foreground text-center">
                                {index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-center">
                                {companies?.[item.companyId]}
                            </TableCell>
                            <TableCell className="font-medium text-center">
                                {item.price}
                            </TableCell>
                            <TableCell className="font-medium text-center pl-5">
                                {fetchStatus(item.status)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-center">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </TableCell>
                            {status == "pending" && 
                            <TableCell className="text-center">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="icon" aria-haspopup="dialog" variant="ghost">
                                            <SquareCheck className="h-5 w-5" color="#37c84f"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogTitle>
                                            Принять заявку
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Вы действительно хотите принять заявку? Это действие невозвратно. Все остальные заявки будут <b>отклонены</b>.
                                        </AlertDialogDescription>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="min-w-12">Нет</AlertDialogCancel>
                                            <AlertDialogAction asChild>
                                                <Button className="min-w-12" variant="default" onClick={(event) => handleYesClick(event, item.tenderId, item.id)}>
                                                    Да
                                                </Button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>}
                            
                        </TableRow>
                    </>
                ))}
            </TableBody>
        </Table>
    )
}