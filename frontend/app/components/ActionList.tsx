import React, { useState } from "react";
import Link from "next/link"
import httpClient from "@/app/http";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { util, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  price: z.string().regex(/^[-]?\d*\.?\d+$/, "Must be a number").pipe(z.coerce.number().int("Must be an integer").positive("Must be a positive number"))
});

type InputSchema = z.input<typeof formSchema>;

interface ActionListProps {
  tenderId: string;
  userRole: string;
  isBidded: boolean;
  onbidChange: (newBiddedValue: boolean) => void;
  isCreator: boolean;
}

export default function ActionList({ tenderId, userRole, isBidded, onbidChange, isCreator }: ActionListProps) {

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
            const handleBid = () => {
              onbidChange(true);
            };
            const [open, setOpen] = useState(false);
            const form = useForm<InputSchema>({
              resolver: zodResolver(formSchema),
              mode: 'onChange',
              defaultValues: {
                price: '-'
              }
            });

            async function onSubmit(values: InputSchema) {
              console.log(JSON.stringify(values));
              console.log(tenderId);
              const response = await httpClient.createBid(tenderId, values);
              await new Promise<void>((resolve) => {
                setTimeout(resolve, 1001);
              });
              console.log("responsik: " + JSON.stringify(response));
              if (response?.errors) {
                console.log("Ошибка")
                for (const [field, messages] of Object.entries(response.errors)) {
                  form.setError(field as any, {
                    type: 'manual',
                    message: (messages as string[]).join(", ")
                  }, { shouldFocus: true });
                }
                toast({
                  variant: "destructive",
                  title: "Что-то пошло не так",
                  description: response.message,
                });
                return;
              }
              setOpen(false);
              handleBid()
            }

            return (
              <Form {...form}>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button key={href}>Подать заявку</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Подать заявку</DialogTitle>
                      <DialogDescription>
                        Предложите свою цену за выполнение указанной работы
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                      <div className="grid gap-4 py-4">
                        <FormField
                          control={form.control}
                          name='price'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Цена</FormLabel>
                              <FormControl>
                                <Input placeholder="Цена" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className={"flex items-center justify-between mt-0"}>
                        {form.formState.isSubmitting && (<Button type="button" disabled> <Loader2
                          className="mr-2 h-4 w-4 animate-spin" />Подать заявку</Button>)}
                        {!form.formState.isSubmitting &&
                          <Button disabled={!form.formState.isValid}
                            type="submit">Подать заявку</Button>}
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </Form>
            );
          default:
            return null;
        }
      })}
    </div >
  );
}