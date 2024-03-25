"use client"

import Image from 'next/image';
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger, navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

const Header = () => {
  return (
    <header className="py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="invisible md:visible md:flex md:w-1/5">
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

        <div className="invisible md:visible md:flex md:w-1/5 absolute right-4 md:relative md:right-0">
          <Button asChild>
            <Link href="/register">
              Регистрация
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;