"use client";

import SheetDrawerComponent from "@/components/SheetDrawerComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPropertyById } from "@/server/property/property";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CounterForm from "./CounterForm";

export default function CountersPage({ params }: { params: { id: number } }) {
  const [selectValue, setSelectValue] = useState<string>("Wähle einen Zähler");

  const { data } = useQuery({
    queryFn: () => getPropertyById(params.id),
    queryKey: ["property"],
  });

  const items = data?.body?.counter?.length
    ? data.body.counter
    : [
        {
          id: 0,
          value: "null",
          number: "Derzeit gibt es keine Zähler für diese Liegenschaft.",
        },
      ];

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 px-4 md:gap-8 md:px-8">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Zähler
          </label>
          <Select
            value={selectValue}
            onValueChange={setSelectValue}
            defaultValue={selectValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wähle einen Zähler" />
            </SelectTrigger>
            <SelectContent>
              {items.map((entry) => (
                <SelectItem key={entry.id} value={entry.number.toString()}>
                  {entry.number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <SheetDrawerComponent title="Neuer Zähler">
          <CounterForm id={params.id} />
        </SheetDrawerComponent>
      </div>
    </div>
  );
}
