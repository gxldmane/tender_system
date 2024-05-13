'use client'

import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
//@ts-ignore
import { usePathname } from 'next/navigation'
import useUser from "@/app/components/useUser";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    role?: string
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
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
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
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {item.title}
          </Link>
        ))}
    </nav>
  )
}