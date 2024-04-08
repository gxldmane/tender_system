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

export default function Header() {
  const { userDetails, isLoading } = useUser();
  console.log("USER ======== ", userDetails);
  console.log("isLoading ======== ", isLoading);
  return (
    <header className="py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className={cn("invisible md:visible md:flex md:w-1/5")}>
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={0} height={0} layout="responsive"/>
          </Link>
        </div>

        <div className="md:hidden flex-1 flex justify-center">
          <Link href="/">
            <Image src="/hammer.svg" alt="Logo" width={60} height={60}/>
          </Link>
        </div>

        <NavigationMenu className={"flex-1 justify-center hidden md:flex space-x-4"}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/browse" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Каталог
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/create-tender" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Разместить
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact-us" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Контакты
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Личный кабинет
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {isLoading ? <div className="invisible md:visible md:flex md:w-1/5 absolute right-4 md:relative md:right-0">
          <Button disabled className='ml-auto'>
            Личный кабинет
          </Button>
        </div> : !userDetails ?
          <div className="invisible md:visible md:flex md:w-1/5 absolute right-4 md:relative md:right-0">
            <Button asChild>
              <Link href="/register" className='ml-auto'>
                Регистрация
              </Link>
            </Button>
          </div> : <div className="invisible md:visible md:flex md:w-1/5 absolute right-4 md:relative md:right-0">
            <Button asChild>
              <Link href="/dashboard" className='ml-auto'>
                Личный кабинет
              </Link>
            </Button>
          </div>
        }
      </div>
    </header>
  );
};