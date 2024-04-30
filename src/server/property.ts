"use server";

import { getServerAuthSession } from "./auth";
import { newPropertySchema } from "@/lib/validators";
import { type z } from "zod";
import { db } from "./db";
import { Flat, flats, property } from "./db/schema";

export default async function createProperty(
  data: z.infer<typeof newPropertySchema>,
) {
  const session = getServerAuthSession();
  if (!session) throw Error();

  try {
    const validData = newPropertySchema.parse(data);
    await db.transaction(async (tx) => {
      const [newProperty] = await tx
        .insert(property)
        .values(validData)
        .returning();

      if (!newProperty) throw Error();

      const normalFlats: Flat[] = Array.from({
        length: newProperty.flats,
      }).map(() => ({ propertyId: newProperty.id, type: "normal" }));

      const commercialFlats: Flat[] = Array.from({
        length: newProperty.commercial,
      }).map(() => ({ type: "commercial", propertyId: newProperty.id }));

      await tx.insert(flats).values(commercialFlats);
      await tx.insert(flats).values(normalFlats);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return { message: "error", error: error.message };
    }
  }
}
