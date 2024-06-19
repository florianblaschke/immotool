"use client";

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
import { expensesSchema } from "@/lib/validators";
import { updateExpenses } from "@/server/property/expenses";
import { getPropertyById } from "@/server/property/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

export default function ExpensesForm() {
  const values = useStatus();
  const { mutate, isPending } = useMutation({
    mutationFn: updateExpenses,
    mutationKey: ["property"],
    onSuccess: (res) => {
      if (res?.message === "success") return toast.success("Das hat geklappt");
      toast.error(res?.error);
    },
  });

  const { data } = useQuery({
    queryFn: () => getPropertyById(values?.propertyId),
    queryKey: ["property"],
  });

  const form = useForm<z.infer<typeof expensesSchema>>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      basicFee: data?.body?.basicFee ?? 0,
      sewage: data?.body?.sewage ?? 0,
      waste: data?.body?.waste ?? 0,
      water: data?.body?.water ?? 0,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          mutate({ data, id: values?.propertyId }),
        )}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="basicFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grundsteuer</FormLabel>
              <FormControl>
                <Input {...field} min={0} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="water"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wasser</FormLabel>
              <FormControl>
                <Input type="number" {...field} min={0} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="waste"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abfall</FormLabel>
              <FormControl>
                <Input type="number" {...field} min={0} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sewage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kanal und Abwasser</FormLabel>
              <FormControl>
                <Input type="number" {...field} min={0} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Speichern
        </Button>
      </form>
    </Form>
  );
}
