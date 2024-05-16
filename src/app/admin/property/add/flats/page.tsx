"use client";

import { useStatus } from "@/components/providers/StatusProvider";
import { getPropertyById } from "@/server/property";
import { useQuery } from "@tanstack/react-query";

export default function FlatsPage() {
  const values = useStatus();
  if (!values) return null;

  const { data, isLoading } = useQuery({
    queryFn: () => getPropertyById(values.propertyId),
    queryKey: [values.propertyId],
  });
  if (!data) return;

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"></div>
    </div>
  );
}
