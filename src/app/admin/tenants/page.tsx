"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import OverviewTable from "@/components/OverviewTable";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, CirclePlus } from "lucide-react";
export default function TenantePage() {
  const tenants = useMemo(
    () => [
      {
        id: "T001",
        name: "John Doe",
        email: "john@example.com",
        address: "123 Main St, Anytown USA",
        property: "Apartment A",
      },
      {
        id: "T002",
        name: "Jane Smith",
        email: "jane@example.com",
        address: "456 Oak Rd, Somewhere City",
        property: "House B",
      },
      {
        id: "T003",
        name: "Bob Johnson",
        email: "bob@example.com",
        address: "789 Elm St, Elsewhere Town",
        property: "Apartment A",
      },
      {
        id: "T004",
        name: "Sarah Lee",
        email: "sarah@example.com",
        address: "321 Pine Ave, Somewhere Else",
        property: "House B",
      },
      {
        id: "T005",
        name: "Tom Wilson",
        email: "tom@example.com",
        address: "654 Maple Ln, Anytown USA",
        property: "Apartment A",
      },
    ],
    [],
  );

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Mieter</CardTitle>
            <CardDescription className="flex w-full flex-col items-start justify-between gap-y-4 md:flex-row md:items-center">
              <span>Mieterdaten und Verträge verwalten</span>
              <Link
                className={cn(buttonVariants({ variant: "default" }), "gap-4")}
                href="/admin/property/add"
              >
                <CirclePlus />
                Neuen Mieter anlegen
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search tenants..."
                />
              </div>
              <div>
                <Label htmlFor="property">Property</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="Apartment A">Apartment A</SelectItem>
                    <SelectItem value="House B">House B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-lg bg-background">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Property</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell>{tenant.name}</TableCell>
                      <TableCell>{tenant.email}</TableCell>
                      <TableCell>{tenant.address}</TableCell>
                      <TableCell>{tenant.property}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
