"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

export default function ExpensesForm() {
  const form = useForm<z.infer<typeof expensesSchema>>({
    resolver: zodResolver(expensesSchema),
    defaultValues: { basicFee: 0, sewage: 0, waste: 0, water: 0 },
  });

  return (
    <Form {...form}>
      <form className="flex w-full max-w-sm flex-col gap-4 ">
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
      </form>
    </Form>
  );
}
