"use client"
import { useSearchParams } from "next/navigation";

export default function TenderBids(){
    const searchParams = useSearchParams();
    const tenderId = searchParams.get('tenderId');
    return(<>{tenderId}</>)
}