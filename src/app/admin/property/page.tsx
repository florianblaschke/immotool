import OverviewTable from "@/components/OverviewTable";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAllProperties } from "@/server/property/property";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export default async function Property() {
  const data = await getAllProperties();
  if (!data?.body) return;

  const properties = data.body;
  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Liegenschaften</CardTitle>
            <CardDescription className="flex w-full flex-col items-start justify-between gap-y-4 md:flex-row md:items-center">
              <span>
                Kostenzuordnungen vornehmen und Details zu Liegenschaften
              </span>
              <Link
                className={cn(buttonVariants({ variant: "default" }), "gap-4")}
                href="/admin/property/add"
              >
                <CirclePlus />
                Neue Liegenschaft hinzufügen
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewTable properties={properties} />
          </CardContent>
          <CardFooter>
            {/* <div className="text-xs text-muted-foreground">
              Zeige <strong>1</strong> von <strong>{properties.length}</strong>{" "}
              Liegenschaften
            </div> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
