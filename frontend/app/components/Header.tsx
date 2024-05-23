"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import useUser from "@/app/components/useUser";
import { cn } from "@/lib/utils";
import { Loader, LogIn, User } from "lucide-react";

export default function Header() {
  const { userDetails, isFetching } = useUser();
  return (
    <header className="w-full flex items-center justify-between py-4 bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={0} height={0} layout="responsive" />
          </Link>
        </div>
        <div className='flex gap-x-4'>
          {userDetails &&
            <div className='hidden md:inline flex sm:mr-4 md:mr-0'>
              <Link href={"/browse"}>
                <Button variant='ghost'>
                  Каталог
                </Button>
              </Link>
            </div>}


          <div className="md:flex md:w-1/5 md:relative md:right-0 flex items-center">
            {isFetching ?
              <Button variant='ghost' disabled className='ml-auto animate-spin'>
                <Loader />
              </Button>
              : !userDetails ?

                <Button asChild>
                  <Link href="/register" className='ml-auto'>
                      <p className='hidden md:inline-flex text-white'>Регистрация</p>
                      <LogIn color='#ffffff' className='inline-flex'/>
                  </Link>
                </Button>
                :
                <Button asChild variant='ghost'>
                  <Link href="/dashboard" className=''>
                    <div className='flex justify-center items-center gap-x-1'>
                      <p className='hidden md:inline-flex'>Личный кабинет</p>
                      <User />
                    </div>
                  </Link>
                </Button>

            }
          </div>
        </div>
      </div>
    </header>
  );
};