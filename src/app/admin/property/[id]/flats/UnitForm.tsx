"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { unitSchema } from "@/lib/validators";
import type { Unit } from "@/server/db/schema";
import updateUnit from "@/server/property/units";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export default function UnitForm({
  unit,
}: {
  unit: Omit<Unit, "id"> & { id: number };
}) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof unitSchema>>({
    values: {
      id: unit.id,
      size: unit.size ?? 0,
      type: unit.type,
      coldRent: unit.coldRent ?? 0,
      utilityRent: unit.utilityRent ?? 0,
      parkingRent: unit.parkingRent ?? 0,
      cellarRent: unit.cellarRent ?? 0,
      others: unit.others ?? [],
      bedRooms: unit.bedRooms ?? "0",
      baths: unit.baths ?? "0",
      floor: unit.floor ?? "0",
      kitchens: unit.kitchens ?? "0",
      livingRooms: unit.livingRooms ?? "0",
      description: unit.description ?? "",
    },
    resolver: zodResolver(unitSchema),
  });

  const others = [
    { id: "cellar", label: "Keller" },
    { id: "elevator", label: "Aufzug" },
    { id: "parkingSpot", label: "Parkplatz" },
  ];

  const { mutate } = useMutation({
    mutationFn: updateUnit,
    onSuccess: (res) => {
      if (res?.message === "error") {
        return toast.error(res.error);
      }
      void queryClient.invalidateQueries({ queryKey: ["property"] });
      toast.success("Das hat geklappt");
    },
  });

  function onSubmit(data: z.infer<typeof unitSchema>) {
    console.log("DATA", data);
    mutate(data);
  }

  return (
    <Form {...form}>
      <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
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
                <FormLabel className="text-sm font-medium">
                  Größe in qm
                </FormLabel>
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="baths"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bäder</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <FormControl>
                      <SelectValue {...field} />
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 6 }).map((entry, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {String(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="bedRooms"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schlafzimmer</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <FormControl>
                      <SelectValue {...field} />
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 6 }).map((entry, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {String(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="kitchens"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Küchen</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <FormControl>
                      <SelectValue {...field} />
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 6 }).map((entry, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {String(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="baths"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bäder</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <FormControl>
                      <SelectValue {...field} />
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {String(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="livingRooms"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wohnzimmer</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <FormControl>
                      <SelectValue {...field} />
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 6 }).map((entry, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {String(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="floor"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etage</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <FormControl>
                      <SelectValue {...field} />
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 6 }).map((entry, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {String(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="others"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Ausstattung</FormLabel>
                <FormDescription>
                  Weitere Ausstattung der Wohnung
                </FormDescription>
              </div>
              <div className="flex items-center gap-4">
                {others.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="others"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
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
                <FormLabel>Kaltmiete</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="parkingRent"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parkplatzmiete</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="cellarRent"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kellermiete</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschreibung</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit">
          Speichern
        </Button>
      </form>
    </Form>
  );
}
