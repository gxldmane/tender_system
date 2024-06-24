import React from "react"
import { SidebarNav } from "../components/SideBar"
import { Bell, Briefcase, FileText, Grid, User } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Личные данные",
    href: "/dashboard",
    icon: <User strokeWidth={1.5} className="hidden md:inline-flex" />
  },
  {
    title: "Мои тендеры",
    href: "/dashboard/tenders",
    role: "customer",
    icon: <Briefcase strokeWidth={1.5} className="hidden md:inline-flex" />
  },
  {
    title: "Поданные заявки",
    href: "/dashboard/bids",
    role: "executor",
    icon: <FileText strokeWidth={1.5} className="hidden md:inline-flex" />
  },
  {
    title: "Уведомления",
    href: "/dashboard/notifications",
    icon: <Bell strokeWidth={1.5} className="hidden md:inline-flex" />
  },
  {
    title: "Каталог",
    href: "/browse",
    icon: <Grid strokeWidth={1.5} className="hidden md:inline-flex"/>
  }
]

interface SettingsLayoutProps {
  children: React.ReactNode
}


export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
      <div className="container space-y-6 p-10 pb-16 md:block">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
  )
}

