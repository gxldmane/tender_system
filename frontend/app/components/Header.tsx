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
    <header className="py-4 bg-white">
      <div className="container mx-auto  flex items-center justify-between">
        <div>
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={0} height={0} layout="responsive" />
          </Link>
        </div>

        {/*<NavigationMenu className={"flex-1 justify-center hidden md:flex space-x-4"}>*/}
        {/*  <NavigationMenuList>*/}
        {/*    <NavigationMenuItem>*/}
        {/*      <Link href="/browse" legacyBehavior passHref>*/}
        {/*        <NavigationMenuLink className={navigationMenuTriggerStyle()}>*/}
        {/*          Каталог*/}
        {/*        </NavigationMenuLink>*/}
        {/*      </Link>*/}
        {/*    </NavigationMenuItem>*/}
        {/*  </NavigationMenuList>*/}
        {/*</NavigationMenu>*/}

        {isFetching ? <div className="md:flex md:w-1/5 absolute right-4 md:relative md:right-0">
          <Button variant='ghost' disabled className='ml-auto animate-spin'>
            <Loader />
          </Button>
        </div> : !userDetails ?
          <div className="md:flex md:w-1/5 absolute right-4 md:relative md:right-0">
            <Button asChild variant='ghost'>
              <Link href="/register" className='ml-auto'>
                <div className='flex justify-center items-center gap-x-1'>
                  <p className='sm:hidden md:inline-flex'>Регистрация</p>
                  <LogIn />
                </div>
              </Link>
            </Button>
          </div> : <div className="md:flex md:w-1/5 absolute right-4 md:relative md:right-0">
            <Button asChild variant='ghost'>
              <Link href="/dashboard" className='ml-auto'>
                <div className='flex justify-center items-center gap-x-1'>
                  <p className='sm:hidden md:inline-flex'>Личный кабинет</p>
                  <User />
                </div>
              </Link>
            </Button>
          </div>
        }
      </div>
    </header>
  );
};