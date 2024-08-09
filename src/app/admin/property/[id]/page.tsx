import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getPropertyById } from "@/server/property/property";
import { translateHeatSystems } from "@/utils/maps";
import {
  BriefcaseIcon,
  ContainerIcon,
  FlameIcon,
  HomeIcon,
  Trash2Icon,
} from "lucide-react";
import { notFound } from "next/navigation";

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const data = await getPropertyById(params.id);

  if (!data?.body) {
    return notFound();
  }

  const { heatingSystem, capacity, commercial, units } = data.body;

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 md:px-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <HomeIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Wohnungen</p>
                <p className="text-sm text-muted-foreground">{units}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Gewerblich</p>
                <p className="text-sm text-muted-foreground">{commercial}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FlameIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Heizung</p>
                <p className="text-sm text-muted-foreground">
                  {translateHeatSystems[heatingSystem]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ContainerIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Tankkapazität</p>
                <p className="text-sm text-muted-foreground">{capacity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Todo List</CardTitle>
          </CardHeader>
          <CardContent>
            <ToDoItem todo="Make this work" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ToDoItem({ todo }: { todo: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Checkbox id="todo-1" />
        <label htmlFor="todo-1" className="text-sm font-medium">
          {todo}
        </label>
      </div>
      <Button variant="ghost" size="icon">
        <Trash2Icon className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
