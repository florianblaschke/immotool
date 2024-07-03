"use client";

import { type Property } from "@/server/db/schema";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { deleteProperty } from "@/server/property/property";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";

export default function OverviewTable({
  properties,
}: {
  properties: Property[];
}) {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProperty,
    onSuccess: (res) => {
      if (res?.message === "error") {
        return toast.error(res.error);
      }
      setOpen(false);
      toast.success("Das hat geklappt.");
    },
  });
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Straße</TableHead>
          <TableHead>Stadt</TableHead>
          <TableHead className="hidden md:table-cell">Wohneinheiten</TableHead>
          <TableHead className="hidden md:table-cell">Kommerziell</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">
              <Link href={"/admin/property/" + entry.id}>
                {entry.street + " " + entry.streetNumber}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={"/admin/property/" + entry.id}>
                {entry.zipCode + " " + entry.city}
              </Link>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Link href={"/admin/property/" + entry.id}>{entry.units}</Link>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Link href={"/admin/property/" + entry.id}>
                {entry.commercial}
              </Link>
            </TableCell>
            <TableCell>
              <Dialog onOpenChange={setOpen} open={open}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                      Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="pb-4">
                      Bist du dir sicher?
                    </DialogTitle>
                    <DialogDescription className="pb-4">
                      Diese Aktion kann nicht rückgängig gemacht werden. Die
                      Liegenschaft und alle zugehörigen Einheiten werden
                      gelöscht.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button
                      disabled={isPending}
                      variant="destructive"
                      onClick={() => mutate(entry.id)}
                    >
                      Löschen
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
