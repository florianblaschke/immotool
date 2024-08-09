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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { counterSchema } from "@/lib/validators";
import { createCounter } from "@/server/property/counters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export default function CounterForm({ id }: { id: number }) {
  const counterOptions = [
    { type: "gas", name: "Gas" },
    { type: "water", name: "Wasser" },
    { type: "electricity", name: "Strom" },
  ];
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createCounter,
    mutationKey: ["counter"],
    onSuccess: (res) => {
      if (res?.message === "error") return toast.error(res?.error);
      router.refresh();
      toast.success("Das hat geklappt");
    },
  });

  const form = useForm<Pick<z.infer<typeof counterSchema>, "type" | "number">>({
    resolver: zodResolver(
      counterSchema.partial({ value: true, valueDate: true }),
    ),
    defaultValues: {
      type: "water",
      number: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={form.handleSubmit((data) => mutate({ data, propertyId: id }))}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zählerart</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <FormControl>
                    <SelectValue {...field} />
                  </FormControl>
                </SelectTrigger>
                <SelectContent>
                  {counterOptions.map((entry) => (
                    <SelectItem value={entry.type} key={entry.type}>
                      {entry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zählernummer</FormLabel>
              <FormControl>
                <Input type="text" {...field} min={0} />
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
