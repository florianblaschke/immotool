"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { cn } from "@/lib/utils";
import { counterValueSchema } from "@/lib/validators";
import { createCounterEntry, getCounterById } from "@/server/property/counters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CirclePlus, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { toast } from "sonner";
import type { z } from "zod";

export default function CounterInsights() {
  const [number] = useSearchParams().getAll("number");
  const counterNumber = number;

  const { data, status } = useQuery({
    queryKey: ["counter", counterNumber],
    queryFn: async () => await getCounterById({ counterNumber }),
  });

  if (!counterNumber && status === "error")
    return <ChartSkeleton message="Bitte wähle einen Zähler aus" />;
  if (!data)
    return (
      <ChartSkeleton
        message={<LoaderCircle className="animate-spin repeat-infinite" />}
      />
    );

  const chartData = data.body?.values.map((entry) => ({
    year: `${new Date(entry.valueDate).getFullYear()}/${new Date(entry.valueDate).getMonth()}`,
    value: entry.value,
  }));

  const chartConfig = {
    counter: {
      label: "Zählerstand",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full justify-between">
          <CardTitle>Zählerstände</CardTitle>
          <AddCounterEntryForm counterNumber={data.body?.id} />
        </div>
        <CardDescription>
          <span>Zählernummer: {counterNumber}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-0">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="value" type="monotone" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function AddCounterEntryForm({
  counterNumber,
}: {
  counterNumber: number | undefined;
}) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createCounterEntry,
    onSuccess: (res) => {
      if (!res || res?.message !== "success") {
        return toast.error(res?.error);
      }
      void queryClient.invalidateQueries();
      return toast.success("Das hat geklappt.");
    },
  });

  const form = useForm<z.infer<typeof counterValueSchema>>({
    defaultValues: { date: new Date(), value: 0 },
    resolver: zodResolver(counterValueSchema),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon">
          <CirclePlus />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-6" align="end">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((val) =>
              mutate({
                date: val.date,
                counterId: Number(counterNumber),
                value: val.value,
              }),
            )}
          >
            <FormField
              name="date"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ablesedatum</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              name="value"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zählerstand</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit" className="w-full">
              Eintragen
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

function ChartSkeleton({ message }: { message: string | ReactElement }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center md:min-h-[398px]">
        {message}
      </CardContent>
    </Card>
  );
}
