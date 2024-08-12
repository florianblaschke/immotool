"use server";

import { unitSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";
import { type z } from "zod";
import { getServerAuthSession } from "../auth";
import { db } from "../db";
import { unit } from "../db/schema";

export default async function updateUnit(data: z.infer<typeof unitSchema>) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Du bist nicht berechtigt.", { cause: 401 });

    const valid = unitSchema.safeParse(data);
    if (!valid.success)
      throw new Error("Bitte stelle korrekte Daten zur Verfügung.");

    const flatToUpdate = await db.query.unit.findFirst({
      where: (unit, { eq }) => eq(unit.id, valid.data.id),
    });
    if (!flatToUpdate) throw new Error("Die Einheit wurde nicht gefunden");

    const {
      coldRent,
      others,
      size,
      type,
      utilityRent,
      baths,
      bedRooms,
      cellarRent,
      description,
      floor,
      kitchens,
      livingRooms,
      parkingRent,
    } = valid.data;

    await db
      .update(unit)
      .set({
        baths,
        bedRooms,
        cellarRent,
        floor,
        description,
        coldRent,
        number: flatToUpdate.number,
        kitchens,
        livingRooms,
        others,
        size,
        parkingRent,
        type,
        utilityRent,
      })
      .where(eq(unit.id, valid.data.id));

    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message };
    }
  }
}
