"use client";

import { useStatus } from "@/components/providers/StatusProvider";
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
import { flatSchema, type tenantSchema } from "@/lib/validators";
import type { Flat } from "@/server/db/schema";
import { getPropertyById } from "@/server/property";
import { createTenant, getAllTenants } from "@/server/tenants";
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
    queryFn: () => getPropertyById(/* values?.propertyId */ 20),
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
    defaultValues: { size: flat.size ?? 0, type: flat.type },
    resolver: zodResolver(flatSchema),
  });

  const { data } = useQuery({
    queryFn: async () => await getAllTenants(),
    queryKey: ["tenants"],
  });

  if (!data) return;

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
          {data?.body && (
            <FormField
              control={form.control}
              name="activeTenant"
              render={({ field }) => {
                const tenantToFind = data.body?.find(
                  (tenant) => tenant.id?.toString() === field.value,
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
                                  value={tenant.id.toString()}
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
                                      tenant.id.toString() === field.value
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
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "default" }),
                "hidden md:block",
              )}
            >
              Neuer Mieter
            </SheetTrigger>
            <SheetContent>
              <TenantForm
                flatId={flat.id}
                propertyId={flat.propertyId}
                closeMenu={setOpenSheet}
              />
            </SheetContent>
          </Sheet>
          <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
            <DrawerTrigger
              className={cn(
                buttonVariants({ variant: "default" }),
                "md:hidden",
              )}
            >
              Neuer Mieter
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Neuer Mieter</DrawerTitle>
                <TenantForm
                  flatId={flat.id}
                  propertyId={flat.propertyId}
                  closeMenu={setOpenDrawer}
                />
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
      </form>
    </Form>
  );
}

function TenantForm({
  flatId,
  propertyId,
  closeMenu,
}: {
  closeMenu: (x: boolean) => void;
  flatId: number;
  propertyId: number;
}) {
  const form = useForm<z.infer<typeof tenantSchema>>({
    defaultValues: {
      coldRent: 0,
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      phone: "",
      utilityRent: 0,
      flatId,
      propertyId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTenant,
    onSuccess: (res) => {
      if (res?.message === "error") {
        return toast.error(res?.error);
      }
      toast.success("Das hat geklappt.");
      closeMenu(false);
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={form.handleSubmit((data) => mutate(data))}
      >
        <div className="flex items-center gap-4">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vorname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nachname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="mobile"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobil</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <FormField
            name="coldRent"
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
        </div>
        <Button disabled={isPending}>Mieter speichern</Button>
      </form>
    </Form>
  );
}
