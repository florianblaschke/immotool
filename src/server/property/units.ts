"use server";

import { type z } from "zod";
import { getServerAuthSession } from "../auth";
import { flatSchema } from "@/lib/validators";
import { db } from "../db";
import { unit, rentContract } from "../db/schema";
import { and, eq } from "drizzle-orm";

export default async function updateUnit(data: z.infer<typeof flatSchema>) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Du bist nicht berechtigt.", { cause: 401 });

    const valid = flatSchema.safeParse(data);
    if (!valid.success)
      throw new Error("Bitte stelle korrekte Daten zur Verfügung.", {
        cause: 500,
      });

    const { activeTenant, size, type, id, coldRent, utilityRent } = valid.data;

    const flatToUpdate = await db.query.unit.findFirst({
      where: (unit, { eq }) => eq(unit.id, id),
    });
    if (!flatToUpdate)
      throw new Error("Die Einheit wurde nicht gefunden", { cause: 500 });

    if (activeTenant) {
      if (
        flatToUpdate.activeTenantId !== null &&
        activeTenant !== flatToUpdate.activeTenantId
      ) {
        throw new Error("Möchtest du bei dieser Einheit den Mieter ändern?", {
          cause: 501,
        });
      }

      if (flatToUpdate.activeTenantId === null) {
        await db.insert(rentContract).values({
          movedIn: new Date().toString(),
          unitId: id,
          tenantId: activeTenant,
          coldRent,
          utilityRent,
        });
      }

      //This needs primary key, otherwise there is confusion if the tenant had rented the flat already sometime
      await db
        .update(rentContract)
        .set({
          coldRent,
          utilityRent,
        })
        .where(
          and(
            eq(rentContract.unitId, id),
            eq(rentContract.tenantId, activeTenant),
          ),
        );
    }

    await db
      .update(unit)
      .set({ activeTenantId: activeTenant, size, type })
      .where(eq(unit.id, id));

    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message, cause: error.cause };
    }
  }
}
