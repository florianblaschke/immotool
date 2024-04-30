import { CirclePlus, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { cn } from "@/lib/utils";

const propertys: {
  address: string;
  income: number;
  tenants: number;
  commercial: number;
}[] = [
  {
    address: "Eichbaumstraße 2b, 63694 Altenstadt",
    income: 14000,
    tenants: 21,
    commercial: 4,
  },
  {
    address: "Am Wiesengrund 3, 63694 Altenstadt-Oberau",
    income: 2600,
    tenants: 21,
    commercial: 4,
  },
  {
    address: "Lange Straße 39, 63674 Limeshain",
    income: 4300,
    tenants: 21,
    commercial: 4,
  },
];

export default function Property() {
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Liegenschaft</TableHead>
                  <TableHead>Einkommen</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Bewohner
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Davon gewerblich
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propertys.map((entry) => (
                  <TableRow key={entry.address}>
                    <TableCell className="font-medium">
                      {entry.address}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.income}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {entry.tenants}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {entry.commercial}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Zeige <strong>1-3</strong> von <strong>3</strong> Liegenschaften
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
