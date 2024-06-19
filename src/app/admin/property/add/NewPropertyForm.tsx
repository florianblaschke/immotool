"use client";

import { queryClient } from "@/components/providers/QueryProvider";
import { useStatus } from "@/components/providers/StatusProvider";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  newPropertySchema,
  type NewPropertyTypeKeys,
  validHeatingSystems,
} from "@/lib/validators";
import createProperty, { getPropertyById } from "@/server/property/property";
import { translateHeatSystems } from "@/utils/maps";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

export default function NewPropertyForm() {
  const form = useForm<z.infer<typeof newPropertySchema>>({
    defaultValues: {
      capacity: 0,
      city: "",
      commercial: 0,
      units: 0,
      heatingSystem: "",
      street: "",
      streetNumber: "",
      zipCode: 0,
    },
    resolver: zodResolver(newPropertySchema),
  });

  const values = useStatus();

  const refetchProperties = () => {
    void queryClient.invalidateQueries({ queryKey: ["property"] });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createProperty,
    onSuccess: (res) => {
      if (res?.message === "error") {
        return toast.error("Das hat nicht geklappt", {
          description: res.error,
        });
      }
      if (values) {
        values.setStatus(true);
        res?.data ? values.setPropertyId(res?.data) : null;
      }
      refetchProperties();
      return toast.success("Das hat geklappt");
    },
  });

  const { data } = useQuery({
    queryFn: () => getPropertyById(values?.propertyId),
    queryKey: ["property"],
  });

  if (values?.status === true && values.propertyId) {
    if (data?.body) {
      Object.entries(data.body).map(([key, value]) =>
        form.setValue(
          key as NewPropertyTypeKeys,
          value as string | number | undefined,
        ),
      );
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={form.handleSubmit((data) => mutate(data))}
      >
        <div className="grid grid-cols-5 gap-x-4 gap-y-2">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Straße</FormLabel>
                <FormControl>
                  <Input
                    type="string"
                    {...field}
                    disabled={values?.status === true}
                  />
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
                  <Input
                    type="text"
                    {...field}
                    disabled={values?.status === true}
                  />
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
                  <Input
                    type="number"
                    min={10000}
                    {...field}
                    disabled={values?.status === true}
                  />
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
                  <Input
                    type="string"
                    {...field}
                    disabled={values?.status === true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 items-end gap-x-4">
          <FormField
            control={form.control}
            name="units"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wohneinheiten</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    disabled={values?.status === true}
                  />
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
                <FormLabel>Gewerblich</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    disabled={values?.status === true}
                  />
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={values?.status === true}
                  >
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
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            disabled={values?.status === true}
                          />
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
        <Button type="submit" disabled={isPending || values?.status === true}>
          Anlegen
        </Button>
      </form>
    </Form>
  );
}
