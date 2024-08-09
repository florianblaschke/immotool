"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { flatSchema } from "@/lib/validators";
import type { Flat } from "@/server/db/schema";
import updateUnit from "@/server/property/units";
import { changeTenant, getAllTenants } from "@/server/tenants";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export default function UnitForm({
  flat,
}: {
  flat: Omit<Flat, "id"> & { id: number };
}) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof flatSchema>>({
    values: {
      id: flat.id,
      size: flat.size ?? 0,
      type: flat.type,
      activeTenant: flat.activeTenantId,
      coldRent: 0,
      utilityRent: 0,
    },
    resolver: zodResolver(flatSchema),
  });

  const { data: tenants } = useQuery({
    queryFn: async () => await getAllTenants(),
    queryKey: ["tenants"],
  });

  const refetchProperty = () => {
    void queryClient.invalidateQueries({ queryKey: ["property"] });
  };

  const { mutate: change } = useMutation({
    mutationFn: async () =>
      await changeTenant({
        flatId: flat.id,
        tenantId: form.getValues("activeTenant")!,
        coldRent: form.getValues("coldRent"),
        utilityRent: form.getValues("utilityRent"),
      }),
    onSuccess: (res) => {
      if (res?.message === "error") {
        return toast.error(res.error);
      }
      toast.success("Das hat geklappt");
    },
  });

  const { mutate } = useMutation({
    mutationFn: updateUnit,
    onSuccess: (res) => {
      if (res?.message === "error") {
        if (res.cause === 501)
          return toast.error(res.error, {
            action: {
              label: "Mieter ändern",
              onClick: () => change(),
            },
          });
        return toast.error(res.error);
      }
      refetchProperty();
      toast.success("Das hat geklappt");
    },
  });

  return (
    <div className="flex flex-col gap-4">
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
                      <SelectItem value="commercial">Gewerblich</SelectItem>
                      <SelectItem value="normal">Wohneinheit</SelectItem>
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {tenants?.body && (
            <FormField
              control={form.control}
              name="activeTenant"
              render={({ field }) => {
                const tenantToFind = tenants.body?.find(
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
                              {tenants.body?.map((tenant) => (
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
          <div className="grid grid-cols-2 gap-2">
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
                  <FormLabel>Warmmiete</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Speichern</Button>
        </form>
      </Form>
    </div>
  );
}
