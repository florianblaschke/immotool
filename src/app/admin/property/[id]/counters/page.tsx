import SheetDrawerComponent from "@/components/SheetDrawerComponent";
import { Card } from "@/components/ui/card";
import { getPropertyById } from "@/server/property/property";
import CounterForm from "./CounterForm";
import { counterMap } from "@/utils/maps";
import Link from "next/link";

export default async function CountersPage({
  params,
}: {
  params: { id: number };
}) {
  const data = await getPropertyById(params.id);

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 px-4 md:gap-8 md:px-8">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <ul className="space-y-4">
            {data?.body?.counter.map((counter) => (
              <li key={counter.id}>
                <Card className="space-y-4 p-4 text-sm">
                  <Link href={`?number=${counter.number}`}>
                    <p>
                      <span className="font-bold">Nummer: </span>
                      {counter.number}
                    </p>
                    <p>
                      <span className="font-bold">Typ: </span>
                      {counterMap[counter.type]}
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
