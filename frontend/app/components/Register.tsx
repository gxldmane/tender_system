"use client"
import React, {FC, useEffect, useState} from "react";
import {useAuth} from '../context/AuthContext';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import useArray from "@/app/components/useArray";
import axios from "axios";
import {CompaniesResponse, Company, RegisterData} from "@/app/http/types";
import httpClient from "@/app/http";
import {useQuery} from "@tanstack/react-query";
import {Skeleton} from "@/components/ui/skeleton";
import {util, z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Separator} from "@radix-ui/react-menu";
import {AlertCircle, ArrowDown01, CheckIcon, ChevronsUpDown, Loader2} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Switch} from "@/components/ui/switch";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {toast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import joinValues = util.joinValues;
import {PasswordInput} from "@/app/components/PasswordInput";

const formSchema = z.object({
  name: z.string().trim().min(1, 'Укажите свое ФИО').max(100, 'Слишком длинное ФИО'),
  email: z.string().trim().email({ message: "Указан неверный email-адрес" }).endsWith(".ru", { message: 'Требуется российский email-адрес' }).toLowerCase().min(1, 'Укажите email-адрес').max(100, 'Слишком длинный email-адрес'),
  password: z.string().min(8, "Пароль должен содержать не менее 8 символов.")
    .max(40, "Пароль должен состоять не более чем из 40 символов.")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(.{8,})$/, "Пароль должен состоять как минимум из одной строчной буквы, как минимум одной прописной буквы, как минимум одной цифры и как минимум одного специального символа."),
  confirm: z.string(),
  role: z.string(),
  company_id: z.number(),
}).refine((data) => data.password === data.confirm, {
  message: "Пароли не совпадают",
  path: ["confirm"],
});

type InputSchema = z.input<typeof formSchema>;
type OutputSchema = z.infer<typeof formSchema>;

export default function Register() {
  const { saveAuthToken } = useAuth();
  const [open, setOpen] = useState(false)
  const form = useForm<InputSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm: '',
    }
  });
  const { data: companies, isLoading, isError } = useQuery({
    queryKey: ['companies'],
    queryFn: httpClient.getCompanies
  });

  async function onSubmit(values: InputSchema) {
    console.log(JSON.stringify(values));
    const response = await httpClient.register(values);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
    console.log("responsik: " + JSON.stringify(response));
    if (response?.errors) {
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
    if (response?.token) {
      saveAuthToken(response.token);
    }
  }

  console.log(form.formState.errors)
  console.log(companies?.data)

  return (
    <div className="flex flex-col items-center justify-center">
      <Card
        className={cn("w-screen max-w-lg h-screen border-none", form.formState.isSubmitting && "animate-pulse")}>
        <CardHeader>
          <CardTitle className={cn(form.formState.isSubmitting && "animate-bounce")}>Регистрация</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8">
          {isLoading || form.formState.isSubmitting || !companies?.data ? (
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ФИО</FormLabel>
                        <FormControl>
                          <Input placeholder="ФИО" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <Separator/>
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
                  <FormField
                    control={form.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Повторите пароль</FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="confirm_password"
                            placeholder="Повторите пароль"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Компания</FormLabel>
                        <div>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? companies.data.find((company) => company.id === field.value)?.name : "Выберите компанию"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Выберите компанию..."
                                  className="h-9"
                                />
                                <CommandEmpty>Компаний не найдено</CommandEmpty>
                                <CommandList>
                                  <CommandGroup>
                                    {companies.data.map((company) => (
                                      <CommandItem
                                        value={company.id}
                                        key={company.id}
                                        onSelect={() => {
                                          form.setValue("company_id", company.id)
                                          setOpen(false)
                                        }}
                                      >
                                        {company.name}
                                        <CheckIcon
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            company.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormDescription>
                          {companies.data[form.getValues('company_id')]?.description}
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Роль</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={"w-[400px]"}>
                              <SelectValue placeholder="Выберите роль"/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={"w-[400px]"}>
                            <SelectItem value="customer">Заказчик</SelectItem>
                            <SelectItem value="executor">Подрядчик</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {form.getValues('role') === 'customer' && "Заказчик может выполнять тендеры"}
                          {form.getValues('role') === 'executor' && "Подрядчик может исполнять тендеры"}
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <div className={"flex items-center justify-between"}>
                    {form.formState.isSubmitting && (<Button type="button" disabled> <Loader2
                      className="mr-2 h-4 w-4 animate-spin"/>Зарегистрироваться</Button>)}
                    {!form.formState.isSubmitting &&
                        <Button disabled={!form.formState.isDirty || !form.formState.isValid}
                                type="submit">Зарегистрироваться</Button>}
                  </div>
                </form>
              </Form>
            </div>
          }
        </CardContent>
      </Card>
    </div>
    // <div className={"flex flex-col items-center justify-center h-screen w-screen p-4 bg-stone-50"}>
    //   <h1 className={"text-2xl font-bold mb-4 text-center"}>Регистрация</h1>
    //   <div className={"w-full max-w-[500px] space-x-4 rounded-md border p-10"}>
    //     <form onSubmit={handleSubmit}>
    //       <Label>Имя</Label>
    //       <Input placeholder="Имя" name="name" onChange={handleChange}/>
    //       <Label>Email</Label>
    //       <Input placeholder="Email" name="email" type="email" onChange={handleChange}/>
    //       <Label>Пароль</Label>
    //       <Input placeholder="Пароль" name="password" type="password" onChange={handleChange}/>
    //       <Label>Роль</Label>
    //       <Select onValueChange={handleRoleChange}>
    //         <SelectTrigger className="w-[180px]">
    //           <SelectValue placeholder="Выберите роль"/>
    //         </SelectTrigger>
    //         <SelectContent>
    //           <SelectGroup>
    //             <SelectItem value="customer">Заказчик</SelectItem>
    //             <SelectItem value="executor">Подрядчик</SelectItem>
    //           </SelectGroup>
    //         </SelectContent>
    //       </Select>
    //       <Label>Компания</Label>
    //       {isLoading || !companies?.data ? <Skeleton className="h-10 w-[180px]"/> :
    //         <Select disabled={companies.data.length === 0} onValueChange={handleCompanyChange}>
    //           <SelectTrigger className="h-10 w-[180px]">
    //             <SelectValue placeholder="Выберите компанию"/>
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectGroup>
    //               {companies.data?.map(value => (
    //                 <SelectItem key={value.id.toString()} value={value.id.toString()}>{value.name}</SelectItem>
    //               ))}
    //             </SelectGroup>
    //           </SelectContent>
    //         </Select>}
    //       <Button className={"mt-3"} type="submit">Зарегистрироваться</Button>
    //     </form>
    //   </div>
    // </div>

  );
}