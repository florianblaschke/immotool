"use client";

import { useStatus } from "@/components/providers/StatusProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
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
import { flatSchema, type tenantSchema } from "@/lib/validators";
import type { Flat, Tenant } from "@/server/db/schema";
import { getPropertyById } from "@/server/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

export default function FlatsPage() {
  const [selectValue, setSelectValue] = useState<string>("1");
  const values = useStatus();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getPropertyById(values?.propertyId),
    queryKey: [values?.propertyId],
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
        {flatToUpdate && (
          <UnitForm flat={flatToUpdate} tenants={property?.tenants} />
        )}
      </div>
    </div>
  );
}

function UnitForm({
  flat,
  tenants,
}: {
  flat: Flat;
  tenants: Tenant[] | undefined;
}) {
  const form = useForm<z.infer<typeof flatSchema>>({
    defaultValues: { size: flat.size ?? 0, type: flat.type },
    resolver: zodResolver(flatSchema),
  });

  return (
    <Form {...form}>
      <form className="flex w-full max-w-sm flex-col gap-4">
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
          <FormField
            control={form.control}
            name="activeTenant"
            render={({ field }) => (
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
                          ? tenants?.find(
                              (tenant) => tenant.id?.toString() === field.value,
                            )?.firstName
                          : "Wähle einen Mieter"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[310px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Mieter suchen..."
                        disabled={tenants?.length === 0}
                      />
                      <CommandEmpty>Keinen Mieter gefunden.</CommandEmpty>
                      <CommandGroup>
                        {tenants?.map((tenant) => (
                          <CommandItem
                            value={tenant.id?.toString()}
                            key={tenant.id}
                            onSelect={() => {
                              form.setValue(
                                "activeTenant",
                                tenant.id!.toString(),
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                tenant.id?.toString() === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {tenant.firstName + " " + tenant.lastName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "default" }),
                "hidden md:block",
              )}
            >
              Neuen Mieter anlegen
            </SheetTrigger>
            <SheetContent>
              <TenantForm />
            </SheetContent>
          </Sheet>
          <Drawer>
            <DrawerTrigger
              className={cn(
                buttonVariants({ variant: "default" }),
                "md:hidden",
              )}
            >
              Neuen Mieter anlegen
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Lege einen neuen Mieter an</DrawerTitle>
                <DrawerDescription>
                  <TenantForm />
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Speichern</Button>
                <DrawerClose>
                  <Button variant="outline">Abbrechen</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </form>
    </Form>
  );
}

function TenantForm() {
  const form = useForm<z.infer<typeof tenantSchema>>({
    defaultValues: {
      coldrent: 0,
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      phone: "",
      utilityRent: 0,
    },
  });

  return (
    <Form {...form}>
      <form className="flex w-full max-w-sm flex-col gap-4">
        <FormField
          name="coldrent"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kaltmiete</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="utilityRent"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nebenkosten</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
