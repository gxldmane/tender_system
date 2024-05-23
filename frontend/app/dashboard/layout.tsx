import React from "react"
import { SidebarNav } from "../components/SideBar"
import useToken from "@/app/components/useToken";
import { router } from "next/client";

const sidebarNavItems = [
    {
      title: "Личные данные",
      href: "/dashboard",
    },
    {
      title: "Мои тендеры",
      href: "/dashboard/tenders",
      role: "customer"
    },
    {
      title: "Мои поданные заявки",
      href: "/dashboard/bids",
      role: "executor"
    },
    {
      title: "Уведомления",
      href: "/dashboard/notifications",
    },
    {
      title: "Каталог",
      href: "/browse"
    }
  ]

interface SettingsLayoutProps {
    children: React.ReactNode
  }


export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
      <>
        <div className="container space-y-6 p-10 pb-16 md:block">
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </>
    )
  }
  
  