"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { newPropertySchema, validHeatingSystems } from "@/lib/validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function NewPropertyForm() {
  const form = useForm<z.infer<typeof newPropertySchema>>({
    defaultValues: {
      capacity: 0,
      city: "",
      commercial: 0,
      flats: 0,
      heatingSystem: "",
      street: "",
      streetNumber: "",
      zipCode: 0,
    },
    resolver: zodResolver(newPropertySchema),
  });

  const translateHeatSystems: Record<string, string> = {
    oil: "Öl",
    districtheat: "Fernwärme",
    gas: "Gas",
    heatpump: "Wärmepumpe",
  };

  function onSubmit(data: z.infer<typeof newPropertySchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-5 gap-x-4 gap-y-2">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Straße</FormLabel>
                <FormControl>
                  <Input type="string" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="streetNumber"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Nummer</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>PLZ</FormLabel>
                <FormControl>
                  <Input type="number" min={10000} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Stadt</FormLabel>
                <FormControl>
                  <Input type="string" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <FormField
            control={form.control}
            name="flats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wohneinheiten</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commercial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Davon gewerblich</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="heatingSystem"
          render={({ field }) => (
            <div className="col-span-full">
              <FormItem className="grid w-full grid-cols-2 gap-4 space-y-0">
                <div className="space-y-2">
                  <FormLabel>Heizungsart</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-2">
                      <FormControl>
                        <SelectValue
                          placeholder="Wähle eine Heizart"
                          {...field}
                        />
                      </FormControl>
                    </SelectTrigger>
                    <SelectContent>
                      {validHeatingSystems.map((entry) => (
                        <SelectItem key={entry} value={entry}>
                          {translateHeatSystems[entry]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
                {field.value === "oil" && (
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tankvolumen in l</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </FormItem>
            </div>
          )}
        />
        <Button type="submit">Anlegen</Button>
      </form>
    </Form>
  );
}
