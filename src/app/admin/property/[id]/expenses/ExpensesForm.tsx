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
import { Input } from "@/components/ui/input";
import { expensesSchema } from "@/lib/validators";
import { type Property } from "@/server/db/schema";
import { updateExpenses } from "@/server/property/expenses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

export default function ExpensesForm({
  id,
  property,
}: {
  id: number;
  property: Property | undefined;
}) {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: updateExpenses,
    mutationKey: ["property"],
    onSuccess: (res) => {
      if (res?.message === "error") return toast.error(res?.error);
      router.refresh();
      toast.success("Das hat geklappt");
    },
  });

  const form = useForm<z.infer<typeof expensesSchema>>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      basicFee: property?.basicFee ?? 0,
      sewage: property?.sewage ?? 0,
      waste: property?.waste ?? 0,
      water: property?.water ?? 0,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate({ data, id }))}
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
