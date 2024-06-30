"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { buttonVariants } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

export default function SheetDrawerComponent({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [openSheet, setOpenSheet] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "hidden w-full max-w-sm md:block",
          )}
        >
          {title}
        </SheetTrigger>
        <SheetContent>
          <SheetTitle className="pb-4">{title}</SheetTitle>
          {children}
        </SheetContent>
      </Sheet>
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerTrigger
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "w-full max-w-sm md:hidden",
          )}
        >
          {title}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="pb-4">{title}</DrawerTitle>
            {children}
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
}
