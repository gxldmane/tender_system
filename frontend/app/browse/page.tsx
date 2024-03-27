"use client"
import React, {useEffect, useState} from 'react';
import TenderCard from '../components/TenderCard';
import {useQuery} from '@tanstack/react-query';
import httpClient from '../http';
import {Skeleton} from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink, PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

export default function Browse() {
  const [tenders, setTenders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [meta, setMeta] = useState(undefined);
  const [links, setLinks] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await httpClient.getAllTenders(currentPage);
        setTenders(response.data);
        setMeta(response.meta);
        setLinks(response.links);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  return (
    <div className='container'>
      <div className="container mx-auto md:w-1/2 space-y-6 p-10 bg-white border-2 rounded-md ">
        {isLoading || !tenders ? (
          <Skeleton className="h-24 w-full rounded-md"/>
        ) : (
          <div>
            <TenderCard items={tenders}/>
          </div>
        )}
      </div>
      <div className={"pt-6"}>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={event => setCurrentPage(currentPage => currentPage - 1)} href="#"/>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis/>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={event => setCurrentPage(currentPage => currentPage + 1)} href="#"/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}