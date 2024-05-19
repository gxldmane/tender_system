"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import httpClient from "@/app/http";
import { ISendedBidsResponse, ITendersResponse } from "@/app/http/types";
import useToken from "@/app/components/useToken";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import useUser from "@/app/components/useUser";
import CustomerTenderBidCard from "@/app/components/CustomerTenderBidCard";
import { cn } from "@/lib/utils";
import { Bird, Loader } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function TenderBids() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tenderId = searchParams.get('tenderId');
    const status = searchParams.get('status');
    const { data: response, isFetching, isError } = useQuery({
        queryKey: ['tender-bids'],
        queryFn: () => httpClient.getTenderBids(tenderId),
        select: data => data?.data as ISendedBidsResponse,
    });
    const currentPage = Number(searchParams.get('page')) || 1;
    const { userDetails } = useUser();
    const { isFetching: isTokenFetching, authToken } = useToken();
    if (isTokenFetching) return;
    if (!authToken) {
        router.push("/login");
        return;
    }
    if (userDetails.role !== 'customer') {
        router.push("/");
        return;
    }

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        const href = `${pathname}?${params.toString()}`;
        return href;
    };

    const createPageNumbers = (maxPages: number) => {
        return Array.from({ length: maxPages }, (_, i) => i + 1);
    };

    if (isFetching) {
        return <div className="container h-4/5 flex flex-col justify-center items-center animate-spin"><Loader /></div>;
    }

    if (response.data?.length === 0) {
        return (
            <div className="container h-4/5 flex flex-col justify-center items-center gap-y-2">
                <h1 className="flex flex-col text-2xl font-extrabold">Заявок на тендер пока нет</h1>
                <Bird width={40} height={40} className="animate-pulse " />
            </div>
        );
    }
    return (
        <div className="container mx-auto flex flex-col mt-10">
            <div className="flex flex-col">
                {isFetching || !response ? (
                    <Skeleton className="h-24 w-full rounded-md" />
                ) : (
                    <>
                        <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader>
                                <CardTitle>Все заявки {response.meta.from ?? 0}-{response.meta.to ?? 0} из {response.meta.total}</CardTitle>
                                <CardDescription>
                                    Управляйте статусом заявок
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            <CustomerTenderBidCard status={status} items={response.data} />
                            </CardContent>
                        </Card>
                    </>
                )}
                <div className="mt-6 mb-6">
                    <Pagination>
                        {!isFetching && <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious className={cn(!response.links.prev && "invisible")}
                                    href={createPageURL(currentPage - 1)} />
                            </PaginationItem>
                            {
                                createPageNumbers(response.meta.last_page).map(
                                    page => (
                                        <PaginationItem key={page}>
                                            <PaginationLink href={createPageURL(page)} isActive={page === currentPage}>{page}</PaginationLink>
                                        </PaginationItem>
                                    )
                                )
                            }
                            <PaginationItem>
                                <PaginationNext className={cn(!response.links.next && "invisible")}
                                    href={createPageURL(currentPage + 1)} />
                            </PaginationItem>
                        </PaginationContent>
                        }
                    </Pagination>
                </div>
            </div>
        </div>)
}