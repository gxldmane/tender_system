"use client"
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import httpClient from "@/app/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckIcon, ChevronsUpDown, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { toast } from "@/components/ui/use-toast";
import { PasswordInput } from "@/app/components/PasswordInput";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import useUser from "@/app/components/useUser";
import useToken from "@/app/components/useToken";
import Link from "next/link";


const formSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Указан неверный email-адрес" })
    .toLowerCase()
    .min(1, 'Укажите email-адрес')
    .max(100, 'Слишком длинный email-адрес'),
  password: z.string()
    .min(8, "Пароль должен содержать не менее 8 символов.")
    .max(40, "Пароль должен состоять не более чем из 40 символов."),
});

type InputSchema = z.input<typeof formSchema>;

export default function Register() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { saveUserData } = useUser();
  const { saveAuthToken } = useToken();
  const form = useForm<InputSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  async function onSubmit(values: InputSchema) {
    console.log(JSON.stringify(values));
    const response = await queryClient.fetchQuery({
      queryKey: ['login'],
      queryFn: () => httpClient.login(values, saveUserData, saveAuthToken),
    });

    console.log("responsik: " + JSON.stringify(response));
    if (response.status === 200) {
      if (!response?.data?.data?.token) return;
      queryClient.setQueryData(['user_data'], response?.data?.data?.details);
      router.push("/dashboard");
      return;
    }
    if (response?.data?.errors) {
      // Highlight form errors
      for (const [field, messages] of Object.entries(response?.data?.errors)) {
        form.setError(field as any, {
          type: 'manual',
          message: (messages as string[]).join(", ")
        }, { shouldFocus: true });
      }
    }
    // General error message toast
    toast({
      variant: "destructive",
      title: "Что-то пошло не так",
      description: response?.data?.message,
    });
    return;
  }

  console.log(form.formState.errors)

  return (
    <div className="flex flex-col items-center justify-center">
      <Card
        className={cn("w-screen max-w-lg h-screen border-none", form.formState.isSubmitting && "animate-pulse")}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={cn(form.formState.isSubmitting && "animate-bounce")}>
              Вход
            </CardTitle>
            или
            <Link href="/register">
              <Button variant={"link"}>Ещё нет аккаунта?</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8">
          {form.formState.isSubmitting ? (
              <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-10 w-full max-w-xs"/>
                  <div className="flex space-x-2">
                  <Skeleton className="h-10 w-10 rounded-md"/>
                    <Skeleton className="h-10 w-10 rounded-md"/>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full rounded-md"/>
                  ))}
                </div>
              </div>
            ) :
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email-адрес</FormLabel>
                        <FormControl>
                          <Input placeholder="Email-адрес" autoComplete="username" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="current_password"
                            placeholder="Пароль"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <div className={"flex items-center justify-between"}>
                    {form.formState.isSubmitting && (<Button type="button" disabled> <Loader2
                      className="mr-2 h-4 w-4 animate-spin"/>Войти</Button>)}
                    {!form.formState.isSubmitting &&
                        <Button disabled={!form.formState.isDirty || !form.formState.isValid}
                                type="submit">Войти</Button>}
                  </div>
                </form>
              </Form>
            </div>
          }
        </CardContent>
      </Card>
    </div>
  );
}