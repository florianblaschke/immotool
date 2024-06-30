"use client";

import { useStatus } from "@/components/providers/StatusProvider";
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
import SheetDrawerComponent from "@/components/SheetDrawerComponent";
import TenantForm from "@/components/TenantForm";

export default function FlatsPage() {
  const [selectValue, setSelectValue] = useState<string>("1");
  const values = useStatus();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getPropertyById(values?.propertyId),
    queryKey: ["property"],
  });

  if (!data || isError || isLoading || !values) return;

  const { body: property } = data;

  const flatToUpdate = property?.unit.find(
    (entry) => entry.number === parseInt(selectValue),
  );

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
