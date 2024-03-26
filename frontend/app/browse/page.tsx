"use client"
import React, {useEffect, useState} from 'react';
import TenderCard from '../components/TenderCard'; // Assuming TenderCard.tsx is in the same directory
import { useQuery } from '@tanstack/react-query';
import httpClient from '../http';

export default function Browse() {
  const [tenders, setTenders] = useState([]); // Create state for tenders
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        const response = await httpClient.getAllTenders();
        setTenders(response.data);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching (success or failure)
      }
    };

    fetchData(); // Fetch data on component mount
  }, []);
  

  return (
    <div className='container'>
      Котей
      <div className="container mx-auto md:w-1/2 space-y-6 p-10 pb-16 bg-white border-2 rounded-md">
        {isLoading ? (
          <p>Loading tenders...</p>
        ) : (
          <TenderCard items={tenders} />
        )}
      </div>
    </div>
  );
}