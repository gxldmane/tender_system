"use client"
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import httpClient from "@/app/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, CheckIcon, ChevronsUpDown, Loader2, Paperclip, UploadCloud, XIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { DropzoneOptions } from "react-dropzone";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/app/components/FileUploader";
import { fileURLToPath } from "url";
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns";


const formSchema = z.object({
  name: z.string().trim().min(1, 'Укажите наименование тендера').max(100, 'Слишком длинное наименование тендера'),
  description: z.string().trim().max(3000, 'Слишком длинное описание тендера'),
  start_price: z.string().regex(/^[-]?\d*\.?\d+$/, "Должно быть число").pipe(z.coerce.number().int("Должно быть целое число").positive("Должно быть положительное число")),
  category_id: z.number().min(0, 'Укажите категорию'),
  region_id: z.number().min(0, 'Укажите регион'),
  until_date: z
    .string()
    .min(1, 'Укажите дату')
    .transform((v) => v.split('.').reverse().join('-'))
    .pipe(z.coerce.date().transform(arg => arg.toISOString().split('T')[0])),
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(5, {
      message: "Maximum 5 files are allowed",
    })
    .min(1, {
      message: "You have to upload minimum 1 file to tender"
    })
    .nullable()
});
type InputSchema = z.input<typeof formSchema>;

interface TenderCreateProps {
  update: boolean
  tenderId?: string
  defaultPropValues?: {
    name: string;
    description: string;
    start_price: string;
    category_id: number;
    region_id: number;
    until_date: string;
  }
  defaultFiles?: File[]
}

export default function TenderCreate({ update, defaultPropValues, tenderId, defaultFiles }: TenderCreateProps) {
  const [openCategories, setOpenCategories] = useState(false);
  const [openRegions, setOpenRegions] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<InputSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: update ? defaultPropValues.name : '',
      description: update ? defaultPropValues.description : '',
      start_price: update ? defaultPropValues.start_price : "",
      category_id: update ? defaultPropValues.category_id : -1,
      region_id: update ? defaultPropValues.region_id : -1,
      until_date: update ? defaultPropValues.until_date : '',
      files: update ? defaultFiles || null : null
    }
  })

  const dropzone = {
    multiple: true,
    maxFiles: 5,
    maxSize: 4 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const { data: categories, isFetching: isCategoriesFetching, isError: isCategoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => httpClient.getCategories(),
    select: data => data?.data?.data,
  });
  const { data: regions, isFetching: isRegionsFetching, isError: isRegionsError } = useQuery({
    queryKey: ['regions'],
    queryFn: () => httpClient.getRegions(),
    select: data => data?.data?.data,
  });

  const downloadFile = (file, fileName) => {
    const url = window.URL.createObjectURL(new Blob([file]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // или любое другое имя файла
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  async function onSubmit(values: InputSchema) {
    const response = await queryClient.fetchQuery({
      queryKey: update ? ['update-tender'] : ['new-tender'],
      queryFn: update ? () => httpClient.updateTender(values, tenderId) : () => httpClient.createTender(values),
    });

    console.log(values);

    if (response?.status === 201) {
      if (!response?.data?.data?.id) return;
      router.push("/view-more?tenderId=" + response?.data?.data?.id);
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
    if (update) {
      await queryClient.refetchQueries({ queryKey: ['tender'], type: 'active' })
      await queryClient.refetchQueries({ queryKey: ['category'], type: 'active' })
      await queryClient.refetchQueries({ queryKey: ['region'], type: 'active' })
    }
    return;
  };


  return (
    <div className="flex flex-col items-center justify-center overflow-y-auto">
      {isCategoriesFetching || isRegionsFetching || form.formState.isSubmitting ? (
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-full max-w-xs" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-md" />
            ))}
          </div>
        </div>
      ) :

        <div className="flex items-center space-x-4 rounded-md border p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg border-none space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Наименование</FormLabel>
                    <FormControl>
                      <Input placeholder="Наименование" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Описание" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Стартовая цена</FormLabel>
                    <FormControl>
                      <Input placeholder="Стартовая цена" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <div>
                      <Popover open={openCategories} onOpenChange={setOpenCategories}>
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
                              {field.value && field.value >= 0 ? categories.find((category) => category.id == field.value)?.name : "Выберите категорию"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Выберите категорию..."
                              className="h-9"
                            />
                            <CommandEmpty>Категорий не найдено</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {
                                  categories.map((category) => (
                                    <CommandItem
                                      value={category.id}
                                      key={category.id}
                                      onSelect={() => {
                                        form.setValue("category_id", category.id, { shouldDirty: true })
                                        form.trigger("category_id")
                                        setOpenCategories(false)
                                      }}
                                    >
                                      {category.name}
                                      <CheckIcon
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          category.id == field.value
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Регион</FormLabel>
                    <div>
                      <Popover open={openRegions} onOpenChange={setOpenRegions}>
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
                              {field.value && field.value >= 0 ? regions.find((company) => company.id === field.value)?.name : "Выберите регион"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Выберите регион..."
                              className="h-9"
                            />
                            <CommandEmpty>Категорий не найдено</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {regions.map((region) => (
                                  <CommandItem
                                    value={region.id}
                                    key={region.id}
                                    onSelect={() => {
                                      form.setValue("region_id", region.id, { shouldDirty: true })
                                      form.trigger("region_id")
                                      setOpenRegions(false)
                                    }}
                                  >
                                    {region.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        region.id === field.value
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="until_date"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>Дата окончания</FormLabel>
                      <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {field.value
                                ? format(field.value, 'dd.MM.yyyy')
                                : 'Выберите дату'}
                              <CalendarIcon className="ml-auto h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-5 flex flex-col">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={(date) => {
                              form.setValue('until_date', format(date, 'yyyy-MM-dd'), { shouldDirty: true });
                              form.trigger('until_date');
                              setTimeout(() => setOpenCalendar(false), 150);
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                  </FormItem>
                )}
              />
              <div
                className={`w-full flex items-center justify-center gap-x-2 rounded-md border-2 border-dashed border-muted-foreground/10 px-2 pb-1 ${form.watch("files") !== null ? "pt-4" : "pt-2"}`}>
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        dropzoneOptions={dropzone}
                      >
                        <FileInput>
                          <div className="flex items-center justify-center flex-col py-10 w-full px-4">
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                            <p className="mb-1 text-sm text-muted-foreground">
                              <span className="font-semibold">Перетащите сюда файлы, чтобы прикрепить их к тендеру</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Максимум 5 файлов, до 4 МБ каждый
                            </p>
                          </div>
                        </FileInput>
                        {field.value && field.value.length > 0 && (
                          <FileUploaderContent className="flex items-center justify-center flex-col w-full px-4">
                            {field.value.map((file, i) => (
                              <FileUploaderItem index={i} key={i} className="py-4 flex items-center">
                                <Paperclip className="h-4 w-4 stroke-current" />
                                <span>{file.name}</span>
                              </FileUploaderItem>
                            ))}
                          </FileUploaderContent>
                        )}
                      </FileUploader>
                    </FormItem>
                  )}
                />
              </div>

              {form.formState.errors && (
                <div className="text-destructive text-sm">
                  {Object.values(form.formState.errors).map((error) => (
                    <p key={error.message}>{error.message}</p>
                  ))}
                </div>
              )}

              <div className={"flex items-center justify-between"}>
                {form.formState.isSubmitting && (<Button type="submit" disabled> <Loader2
                  className="mr-2 h-4 w-4 animate-spin" />Зарегистрироваться</Button>)}
                {!form.formState.isSubmitting &&
                  <Button disabled={!form.formState.isDirty || !form.formState.isValid}
                    type="submit">{update ? "Сохранить тендер" : "Создать тендер"}</Button>}
              </div>
            </form>
          </Form>
        </div>
      }
    </div>
  );
}