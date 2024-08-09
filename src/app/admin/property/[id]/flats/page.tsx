"use client";

import SheetDrawerComponent from "@/components/SheetDrawerComponent";
import TenantForm from "@/components/TenantForm";
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
import UnitForm from "./UnitForm";

export default function FlatsPage({ params }: { params: { id: number } }) {
  const [selectValue, setSelectValue] = useState<string>("1");

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getPropertyById(params.id),
    queryKey: ["property"],
  });

  if (!data || isError || isLoading) return;

  const { body: property } = data;

  const flatToUpdate = property?.unit.find(
    (entry) => entry.number === parseInt(selectValue),
  );

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 px-4 md:gap-8 md:px-8">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Wohnungnummer
          </label>
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {property?.unit
                .sort((a, b) => a.number - b.number)
                .map((entry) => (
                  <SelectItem key={entry.id} value={entry.number.toString()}>
                    {entry.number}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        {flatToUpdate && <UnitForm flat={flatToUpdate} />}
        <SheetDrawerComponent title="Neuer Mieter">
          <TenantForm />
        </SheetDrawerComponent>
      </div>
    </div>
  );
}
