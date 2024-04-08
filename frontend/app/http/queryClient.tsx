"use client"

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Provider({ children }: { children: React.ReactNode }) {
  const [client] = useState<QueryClient>(queryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
};