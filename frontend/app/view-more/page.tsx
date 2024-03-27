"use client"
import { useEffect, useState } from 'react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import httpClient from '../http';

interface TenderData {
    name: string;
    description: string;
    start_price: number;
    category_id: number;
    createdAt: string;
    untilDate: string;
  }

function daysSinceTenderCreation(createdAt) {
    // Parse the date string in ISO-8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
    const tenderDate = new Date(createdAt);
  
    // Get today's date
    const today = new Date();
  
    // Calculate the difference in days
    const differenceInDays = Math.floor((today - tenderDate) / (1000 * 60 * 60 * 24));
  
    // Determine the text based on the difference
    let timeSinceCreation;
    if (differenceInDays === 0) {
      timeSinceCreation = "Сегодня";
    } else if (differenceInDays === 1) {
      timeSinceCreation = "Вчера";
    } else {
      timeSinceCreation = `${differenceInDays} дней назад`;
    }
  
    return timeSinceCreation;
  }

function getRemainingTime(untilDate: string): string {
    const now = new Date();
    const endDate = new Date(untilDate);
    const diff = endDate.getTime() - now.getTime();
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
    let remainingText = "";
    if (days > 0) {
      remainingText += `${days} дней, `;
    }
    if (hours > 0) {
      remainingText += `${hours} часов, `;
    }
    remainingText += `${minutes} минут`;
  
    return remainingText;
  }

  

// const getTenderData = async () => {
//   const response = await fetch('/api/tender/1'); // Замените "1" на ID вашего тендера
//   const data = await response.json();
//   return data;
// };

export default function ViewMore() {
//   const [tenderData, setTenderData] = useState(null);

// //   useEffect(() => {
// //     getTenderData().then((data) => setTenderData(data));
// //   }, []);
    const [categoryName, setCategoryName] = useState('');


  
    const tenderData: TenderData = require('./tender.json').data;  
    const { name, description, start_price, categoryId, createdAt, untilDate } = tenderData; 
    useEffect(() => {
    const fetchCategoryName = async () => {
        try {
          const categoryData = await httpClient.getCategoryById(categoryId);
          setCategoryName(categoryData.name); // Assuming the category name is in a property named "name"
        } catch (error) {
          console.error('Error fetching category name:', error);
          // Handle errors appropriately, e.g., display an error message to the user
        }
      };
        fetchCategoryName();}, [categoryId]);
    if (!tenderData) return <div>Loading...</div>;
    return (
        <div className="container hidden flex-col md:flex">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                            Начальная цена
                            </CardTitle>
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                            >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₽ {(start_price).toLocaleString('ru')}</div>
                            <p className="text-xs text-muted-foreground">
                                Цена установленая заказчиком
                            </p>
                        </CardContent>
                        </Card>
                        <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                            Категория тендера
                            </CardTitle>
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                            >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">category_name</div>
                            <p className="text-xs text-muted-foreground">
                                Категория №{categoryId}
                            </p>
                        </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Создан:</CardTitle>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                                >
                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                <path d="M2 10h20" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{new Date(createdAt).toLocaleDateString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    {daysSinceTenderCreation(createdAt)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    До окончания:
                                </CardTitle>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                                >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold">{getRemainingTime(untilDate)}</div>
                                <p className="text-xs text-muted-foreground">
                                    
                                </p>
                            </CardContent>
                        </Card>  
                    </div>
                    </TabsContent>
                </Tabs>
            </div>
    </div>
    )}





{/* <p>Создан:<br></br> {new Date(createdAt).toLocaleDateString()}</p>
<p>До окончания:<br></br> {getRemainingTime(untilDate)}</p> */}
