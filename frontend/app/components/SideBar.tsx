'use client'

import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { usePathname } from 'next/navigation'
import useUser from "@/app/components/useUser";
import { LucideIcon } from "lucide-react"
import React from "react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    role?: string
    icon: React.ReactNode
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const { isFetching, userDetails } = useUser();

  if (isFetching) {
    return <div/>;
  }

  return (
    <nav
      className={cn(
        "grid grid-cols-2 lg:flex lg:flex-col lg:space-x-0 lg:space-y-1 rounded-md bg-white",
        className
      )}
      {...props}
    >
      {items.filter(item => !item?.role || item.role === userDetails?.role)
        .map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-gray-100 hover:bg-muted"
                : "hover:bg-muted hover:underline",
              "justify-start", "flex items-center gap-x-2"
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
    </nav>
  )
}