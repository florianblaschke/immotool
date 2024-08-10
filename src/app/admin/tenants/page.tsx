"use client";

import SheetDrawerComponent from "@/components/SheetDrawerComponent";
import TenantForm from "@/components/TenantForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllTenants } from "@/server/tenants";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import TentantTable from "./Tenanttable";

export default function TenantePage() {
  const { data } = useQuery({
    queryKey: ["allTenants"],
    queryFn: async () => await getAllTenants(),
  });

  const tenants = useMemo(() => {
    if (!data?.body) return [];
    return data.body;
  }, [data]);

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Mieter</CardTitle>
            <CardDescription className="flex w-full flex-col items-start justify-between gap-y-4 md:flex-row md:items-center">
              <span>Mieterdaten und Verträge verwalten</span>
              <SheetDrawerComponent title="Neuen Mieter anlegen">
                <TenantForm />
              </SheetDrawerComponent>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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
              <TentantTable data={tenants} />
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
