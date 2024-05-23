import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { StrictMode, } from "react";
import Header from "@/app/components/Header";
import { Toaster } from "@/components/ui/toaster";
import InternalQueryClientProvider from "@/app/http/queryClient";
import NotificationToaster from "./notificationToaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZXC–TENDER – Платформа для проведения тендеров",
  description: "Платформа для проведения тендеров",
};

function Footer() {
  return (
    <footer className="bg-gray-100 p-4 dark:bg-gray-800 absolute bottom-0 left-0 right-0">
      <div className="container mx-auto flex justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 ZXC Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}


function DottedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* // className="absolute inset-0 w-full h-full bg-gray-100 bg-white dark:bg-stone-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px] bg-repeat"> */}
      {children}
    </div>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
    <body className={`${inter.className}`}>
    <StrictMode>
      <InternalQueryClientProvider>
        <DottedBackground>
          <Header/>
          {children}
          <Toaster/>
          <NotificationToaster/>
        </DottedBackground>
      </InternalQueryClientProvider>
    </StrictMode>
    </body>
    </html>
  );
}
