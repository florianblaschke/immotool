"use client";

import { queryClient } from "@/components/providers/QueryProvider";
import { useStatus } from "@/components/providers/StatusProvider";
import TenantForm from "@/components/TenantForm";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { flatSchema } from "@/lib/validators";
import type { Flat } from "@/server/db/schema";
import { getPropertyById } from "@/server/property";
import { getAllTenants } from "@/server/tenants";
import updateUnit from "@/server/units";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

export default function FlatsPage() {
  const [selectValue, setSelectValue] = useState<string>("1");
  const values = useStatus();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getPropertyById(values?.propertyId),
    queryKey: ["property"],
  });

  if (!data || isError || isLoading || !values) return;

  const { body: property } = data;

  const flatToUpdate = property?.flats.find(
    (entry) => entry.number === parseInt(selectValue),
  );

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Wohnungnummer
          </label>
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {property?.flats
                .sort((a, b) => a.number - b.number)
                .map((entry) => (
                  <SelectItem key={entry.id} value={entry.number.toString()}>
                    {entry.number}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        {flatToUpdate && <UnitForm flat={flatToUpdate} />}
      </div>
    </div>
  );
}

function UnitForm({ flat }: { flat: Omit<Flat, "id"> & { id: number } }) {
  const [openSheet, setOpenSheet] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const form = useForm<z.infer<typeof flatSchema>>({
    values: {
      id: flat.id,
      size: flat.size ?? 0,
      type: flat.type,
      activeTenant: flat.activeTenantId,
    },
    resolver: zodResolver(flatSchema),
  });

  const { data } = useQuery({
    queryFn: async () => await getAllTenants(),
    queryKey: ["tenants"],
  });

  const refetchProperty = () => {
    void queryClient.invalidateQueries({ queryKey: ["property"] });
  };

  const { mutate } = useMutation({
    mutationFn: updateUnit,
    onSuccess: (res) => {
      if (res?.message === "error") return toast.error(res.error);
      refetchProperty();
      toast.success("Das hat geklappt");
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={form.handleSubmit((data) => mutate(data))}
      >
        <FormField
          name="id"
          control={form.control}
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="size"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Größe in qm</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wohnungstyp</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <FormControl>
                    <SelectValue {...field} />
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="commercial">Kommerziell</SelectItem>
                    <SelectItem value="normal">Wohneinheit</SelectItem>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid items-end gap-2 md:grid-cols-2">
          {data?.body && (
            <FormField
              control={form.control}
              name="activeTenant"
              render={({ field }) => {
                const tenantToFind = data.body?.find(
                  (tenant) => tenant.id === field.value,
                );
                return (
                  <FormItem className="flex w-full flex-col pt-2">
                    <FormLabel>Aktueller Mieter</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              " justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? tenantToFind?.firstName +
                                " " +
                                tenantToFind?.lastName
                              : "Wähle einen Mieter"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[310px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Mieter suchen..." />
                          <CommandEmpty>Keinen Mieter gefunden.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {data.body?.map((tenant) => (
                                <CommandItem
                                  value={
                                    tenant.firstName + " " + tenant.lastName
                                  }
                                  key={tenant.id}
                                  onSelect={() => {
                                    form.setValue("activeTenant", tenant.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      tenant.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {tenant.firstName + " " + tenant.lastName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                );
              }}
            />
          )}
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "hidden md:block",
              )}
            >
              Neuer Mieter
            </SheetTrigger>
            <SheetContent>
              <TenantForm closeMenu={setOpenSheet} />
            </SheetContent>
          </Sheet>
          <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
            <DrawerTrigger
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "md:hidden",
              )}
            >
              Neuer Mieter
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Neuer Mieter</DrawerTitle>
                <TenantForm closeMenu={setOpenDrawer} />
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
        <Button type="submit">Speichern</Button>
      </form>
    </Form>
  );
}
