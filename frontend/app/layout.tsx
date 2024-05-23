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

function DottedBackground({ children }: { children: React.ReactNode }) {
  return (
    <span className="dot-mask">
      <div
        className="absolute inset-0 я w-full bg-white dark:bg-stone-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]">
        {children}
      </div>
    </span>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <StrictMode>
          <InternalQueryClientProvider>
            <DottedBackground>
              <Header />
              {children}
              <NotificationToaster />
            </DottedBackground>
          </InternalQueryClientProvider>
        </StrictMode>
      </body>
    </html>
  );
}
