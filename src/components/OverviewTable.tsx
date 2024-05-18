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
import { deleteProperty } from "@/server/property";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
              {entry.street + " " + entry.streetNumber}
            </TableCell>
            <TableCell>{entry.zipCode + " " + entry.city}</TableCell>
            <TableCell className="hidden md:table-cell">
              {entry.units}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {entry.commercial}
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
                    <DialogTitle>Bist du dir sicher?</DialogTitle>
                    <DialogDescription>
                      Diese Aktion kann nicht rückgängig gemacht werden. Die
                      Liegenschaft und alle zugehörigen Einheiten werden
                      gelöscht.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="secondary">Abbrechen</Button>
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
