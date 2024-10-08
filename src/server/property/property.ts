"use server";

import { ActionError } from "@/lib/utils";
import { newPropertySchema } from "@/lib/validators";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ZodError, type z } from "zod";
import { getServerAuthSession } from "../auth";
import { db } from "../db";
import { property, unit, type Unit } from "../db/schema";

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

    let propertyId = 0;

    await db.transaction(async (tx) => {
      const [newProperty] = await tx
        .insert(property)
        .values(validData)
        .returning();

      if (!newProperty) throw Error();

      propertyId = newProperty.id;

      if (validData.commercial > 0) {
        const commercialunit: Unit[] = Array.from({
          length: newProperty.commercial,
        }).map((_, i) => ({
          type: "commercial",
          propertyId: newProperty.id,
          number: i + newProperty.units + 1,
        }));

        await tx.insert(unit).values(commercialunit);
      }
      if (validData.units > 0) {
        const normalunit: Unit[] = Array.from({
          length: newProperty.units,
        }).map((_, i) => ({
          propertyId: newProperty.id,
          type: "normal",
          number: i + 1,
        }));
        await tx.insert(unit).values(normalunit);
      }
    });
    revalidatePath("/admin/property");
    return { message: "success", body: propertyId };
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

export async function getPropertyById(id: number | undefined) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("unauthorized", { cause: 401 });
    if (!id) throw new Error("missing id", { cause: 404 });

    const property = await db.query.property.findFirst({
      where: (property, { eq }) => eq(property.id, id),
      with: { unit: true, counter: true },
    });
    return { message: "success", body: property };
  } catch (error) {
    if (error instanceof Error)
      return { message: "error", error: error.message };
    if (error instanceof Error) {
      if (error.cause === 401) {
        return {
          message: "error",
          error: "Du bist nicht berechtigt für diese Aktion.",
        };
      }
      if (error.cause === 404) {
        return {
          message: "error",
          error: "Es gab keine passenden Ergebnisse zu deiner Suchanfrage.",
        };
      }
    }
  }
}

export async function getAllProperties(limit = 0, offset = 0) {
  try {
    const properties = await db.query.property.findMany({ limit, offset });
    return { messag: "success", body: properties };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message };
    }
  }
}

export async function deleteProperty(id: number) {
  try {
    await db.delete(property).where(eq(property.id, id));
    revalidatePath("/property");
    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message };
    }
  }
}
