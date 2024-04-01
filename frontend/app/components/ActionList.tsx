import React from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface ActionListProps {
      userRole: string;
      isBidded: boolean;
      isCreator: boolean;
  }

export default function ActionList({ userRole, isBidded, isCreator }: ActionListProps){
  const actions = () => {
    switch (userRole) {
      case 'customer':
        return isCreator ? [
          'download',
          'applications',
          'delete',
          'edit',
        ] : ['download'];
      case 'executor':
        return isBidded ? ['download', 'withdraw'] : ['download', 'apply'];
      default:
        return [];
    }
  };
  return (
    <div className="flex items-center gap-4 pt-4 flex-wrap">
      {actions().map((action) => {
        const href = `/${action}`;

        switch (action) {
          case 'download':
            return (
              <Button className='min-w-36' key={action}>
                Скачать файлы
              </Button>
            );
          case 'applications':
            return (
              <Link href={href}>
                <Button className='min-w-36' key={action}>Список заявок</Button>
              </Link>
            );
          case 'delete':
            return (
              <Link href={href}>
                <Button className='min-w-36' key={action}>
                  Удалить тендер
                </Button>
              </Link>
            );
          case 'edit':
            return (
              <Link href={href}>
                <Button className='min-w-36' key={action}>Изменить тендер</Button>
              </Link>
            );
          case 'withdraw':
            return (
              <Link href={href}>
                <Button className='min-w-36' key={action}>
                  Отозвать заявку
                </Button>
              </Link>
            );
          case 'apply':
            return (
              <Link href={href}>
                <Button className='min-w-36' key={action}>Подать заявку</Button>
              </Link>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}