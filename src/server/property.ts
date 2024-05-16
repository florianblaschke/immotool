"use server";

import { ActionError } from "@/lib/utils";
import { newPropertySchema } from "@/lib/validators";
import { and } from "drizzle-orm";
import { ZodError, type z } from "zod";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { Flat, flats, property } from "./db/schema";

export default async function createProperty(
  data: z.infer<typeof newPropertySchema>,
) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new ActionError("unauthorized", { code: 401 });

    const validData = newPropertySchema.parse(data);

    const existingProptery = await db.query.property.findFirst({
      where: (property, { eq }) =>
        and(
          eq(property.street, validData.street),
          eq(property.streetNumber, validData.streetNumber),
        ),
    });
    if (existingProptery)
      throw new ActionError("property exists already", { code: 500 });

    let propertyId: number = 0;

    await db.transaction(async (tx) => {
      const [newProperty] = await tx
        .insert(property)
        .values(validData)
        .returning();

      if (!newProperty) throw Error();

      propertyId = newProperty.id;

      const normalFlats: Flat[] = Array.from({
        length: newProperty.units,
      }).map((_, i) => ({
        propertyId: newProperty.id,
        type: "normal",
        number: i + 1,
      }));

      const commercialFlats: Flat[] = Array.from({
        length: newProperty.commercial,
      }).map((_, i) => ({
        type: "commercial",
        propertyId: newProperty.id,
        number: i + newProperty.units + 1,
      }));

      await tx.insert(flats).values(commercialFlats);
      await tx.insert(flats).values(normalFlats);
    });
    return { message: "success", data: propertyId };
  } catch (error) {
    if (error instanceof ActionError) {
      if (error.cause === 401)
        return {
          message: "error",
          error: "Du bist nicht berechtig für diese Aktion.",
        };
      if (error.cause === 500)
        return {
          message: "error",
          error: "Die Wohneinheit existiert bereits.",
        };
    }
    if (error instanceof Error) {
      console.error(error);
      return { message: "error", error: error.message };
    }
    if (error instanceof ZodError) {
      return {
        message: "error",
        error: "Deine eingegebene Daten sind ungültig.",
      };
    }
  }
}

export async function getPropertyById(id: number) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new ActionError("unauthorized", { code: 401 });

    const property = await db.query.property.findFirst({
      where: (property, { eq }) => eq(property.id, id),
      with: { flats: true, tenants: true },
    });
    return { message: "success", body: property };
  } catch (error) {
    if (error instanceof Error)
      return { message: "error", error: error.message };
    if (error instanceof ActionError) {
      if (error.cause === 401) {
        return {
          message: "error",
          error: "Du bist nicht berechtigt für diese Aktion.",
        };
      }
    }
  }
}
