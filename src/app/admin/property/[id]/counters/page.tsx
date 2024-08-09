import SheetDrawerComponent from "@/components/SheetDrawerComponent";
import { Card } from "@/components/ui/card";
import { getPropertyById } from "@/server/property/property";
import CounterForm from "./CounterForm";
import { counterMap } from "@/utils/maps";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function CountersPage({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams: { number: string };
}) {
  const data = await getPropertyById(params.id);

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 md:gap-8 md:px-8">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <ul className="max-h-[350px] space-y-4 overflow-y-auto">
            {data?.body?.counter.map((counter) => (
              <li key={counter.id}>
                <Card
                  className={cn(
                    "space-y-4 p-4 text-sm",
                    searchParams.number === counter.number &&
                      "bg-primary text-muted",
                  )}
                >
                  <Link href={`?number=${counter.number}`}>
                    <p className="text-base font-medium">
                      {counterMap[counter.type]}
                    </p>
                    <p
                      className={cn(
                        "text-xs text-muted-foreground",
                        searchParams.number === counter.number &&
                          "bg-primary text-muted",
                      )}
                    >
                      Nr: {counter.number}
                    </p>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </div>
        <SheetDrawerComponent title="Neuen Zähler anlegen">
          <CounterForm id={params.id} />
        </SheetDrawerComponent>
      </div>
    </div>
  );
}
