import React, { useEffect, useState } from "react";
import Link from "next/link"
import httpClient from "@/app/http";
import { ArrowUpSquare, Key, Loader2, Pencil, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { set, useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { util, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast"
import { useQueryClient } from "@tanstack/react-query";
import { CreateBidResponse } from "@/app/http/types";
import { IErrorResponse } from "@/app/http/httpClient";
import { Download } from "lucide-react";
import { File as FileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import TenderCreate from "./TenderCreate";


const formSchema = z.object({
  price: z.string().regex(/^[-]?\d*\.?\d+$/, "Must be a number").pipe(z.coerce.number().int("Must be an integer").positive("Must be a positive number"))
});

type InputSchema = z.input<typeof formSchema>;



function getFileNameFromUrl(url) {
  var parts = url.split('/');
  var filenameWithExtension = parts.pop();
  var filenameWithoutQuery = filenameWithExtension.split('?')[0];
  console.log(filenameWithoutQuery);
  return filenameWithoutQuery;
}

function getFileTypeIconFromUrl(url) {
  const extension = url.split('.').pop().toLowerCase();
  console.log(extension + " Extension")
  console.log(url + " url")

  if (['pdf'].includes(extension)) {
    return <FileIcon className="h-9 w-9" />
  }
  return <FileIcon className="h-9 w-9" />; //todo: найти норм картинки pdf docx / починить чтобы работало иф элсе это
}

function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName);
}


interface ActionListProps {
  tenderId: string;
  userRole: string;
  isBidded: boolean;
  isCreator: boolean;
  filesList: {
    id: string;
    tenderId: string;
    url: string;
    name: string;
  }[];
  defaultValues: {
    name: string;
    description: string;
    start_price: string;
    category_id: number;
    region_id: number;
    until_date: string;
  }
}

export default function ActionList({ tenderId, userRole, isBidded, isCreator, filesList, defaultValues }: ActionListProps) {
  const getFilesFromFilesList = async (files: ActionListProps['filesList']) => {
    const fileArray: File[] = [];
    for (const file of files) {
      const url = file.url
      const response = await queryClient.fetchQuery({
        queryKey: ['download-file'],
        queryFn: () => httpClient.downloadFile(url),
      }).then<Blob | IErrorResponse | any>(value => value?.data);
      console.log("responsik: " + JSON.stringify(response));
      if (response?.errors) {
        console.log("Ошибка");
        toast({
          variant: "destructive",
          title: "Что-то пошло не так",
          description: response.message,
        });
        return;
      }
      const convertedFile = blobToFile(response, file.name)
      fileArray.push(convertedFile)
      console.log(`Файл: ${convertedFile.name} Размер: ${convertedFile.size}`)
    }

    return fileArray;
  }
  const [files, setFiles] = useState<File[] | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const fileArray = await getFilesFromFilesList(filesList);
      setFiles(fileArray);
    };
    fetchFiles();
  }, [filesList]);
  console.log(filesList)
  let queryClient = useQueryClient();
  const router = useRouter()
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
    <div className="flex items-center w-full gap-4 pt-4 pb-4">
      {actions().map((action) => {
        const href = `/${action}`;

        switch (action) {
          case 'download':
            const downloadFile = (file, fileName) => {
              const url = window.URL.createObjectURL(new Blob([file]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', fileName); // или любое другое имя файла
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }

            const handleDownloadClick = async (event, url, fileName) => {
              const response = await queryClient.fetchQuery({
                queryKey: ['download-file'],
                queryFn: () => httpClient.downloadFile(url),
              }).then<Blob | IErrorResponse | any>(value => value?.data);
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
              downloadFile(response, fileName); // добавлено
            }
            return (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className='' key={action}>Файлы</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Скачать файлы</DialogTitle>
                    <DialogDescription>
                      Выберите файл прикрепленный к тендеру заказчиком
                    </DialogDescription>
                  </DialogHeader>
                  <div className="pt-5 flex flex-col gap-y-2">
                    {
                      filesList.map((file) => {
                        return (
                          <div className="flex justify-between align-center">
                            <div className="flex items-center gap-x-2.5">
                              {getFileTypeIconFromUrl(file.url)}
                              <p>{file.name}</p>
                            </div>
                            <div>
                              <Button size="icon" onClick={(event) => handleDownloadClick(event, file.url, file.name)}><Download className="h-5 w-5" /></Button>
                            </div>
                          </div>
                        )
                      }
                      )}
                  </div>
                </DialogContent>
              </Dialog>
            );
          case 'applications':
            return (
              <Link href={href}>
                <Button className='' key={action}>Заявки</Button>
              </Link>
            );
          case 'edit':
            return (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant='ghost' size='icon' key={action}><Pencil size={30} color="#000000" strokeWidth={1.5} /></Button>
                </SheetTrigger>
                <SheetContent className={"p-8 min-w-fit overflow-y-scroll"}>
                  <SheetHeader>
                    <SheetTitle>Редактирование тендера</SheetTitle>
                  </SheetHeader>
                  <TenderCreate update={true} tenderId={tenderId} defaultPropValues={defaultValues} defaultFiles={files} />
                </SheetContent>
              </Sheet>

            );
          case 'delete':
            const handleDeleteTenderClick = async (event) => {
              const response = await queryClient.fetchQuery({
                queryKey: ['delete-tender'],
                queryFn: () => httpClient.deleteTender(tenderId),
              }).then<CreateBidResponse | IErrorResponse | any>(value => value?.data);
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
              toast({
                variant: "default",
                title: "Тендер успешно удален",
                description: "Это действие безвозвратно",
              });
              router.push("/tenders");
              return;
            }
            return (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="ml-auto" size="icon" key={action}>
                    <Trash2 className="p-1" size={36} color="#ffffff" strokeWidth={1.5} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены, что хотите удалить тендер?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы не сможете отменить это действие.<br /> Тендер будет удален <b>навсегда</b> и <b>безвозвратно!</b>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="min-w-16">Нет</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button className="min-w-16" variant="default" onClick={handleDeleteTenderClick}>
                        Да
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          case 'withdraw':
            const handleClick = async (event) => {
              const response = await queryClient.fetchQuery({
                queryKey: ['delete-bid'],
                queryFn: () => httpClient.deleteBid(tenderId),
              }).then<CreateBidResponse | IErrorResponse | any>(value => value?.data);
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
              toast({
                variant: "default",
                title: "Заявка успешно отменена",
                description: "Вы можете подать ее снова, нажав на кнопку 'Подать заявку'",
              });
              await queryClient.refetchQueries({ queryKey: ['hasBid'], type: 'active' })
            }

            return (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-1/3" variant="default">Отозвать заявку</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены, что хотите отменить заявку?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы сможете заново подать заявку в карточке тендера, но дата изменится.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="min-w-16">Нет</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button className="min-w-16" variant="default" onClick={handleClick}>
                        Да
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          case 'apply':
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
              const response = await queryClient.fetchQuery({
                queryKey: ['create-bid'],
                queryFn: () => httpClient.createBid(tenderId, values),
              }).then<CreateBidResponse | IErrorResponse | any>(value => value?.data);

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
              toast({
                variant: "default",
                title: "Заявка успешно подана",
                description: "Вы можете отслеживать ее статус в своем профиле",
              });
              setOpen(false);
              await queryClient.refetchQueries({ queryKey: ['hasBid'], type: 'active' })
            }

            return (
              <Form {...form}>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="border-2 w-1/3" variant='secondary' key={href}>Подать заявку</Button>
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
            return (
              <div>
                Такого тендера не существует
              </div>
            )
        }
      })}
    </div >
  );
}