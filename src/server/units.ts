"use server";

import { type z } from "zod";
import { getServerAuthSession } from "./auth";
import { flatSchema } from "@/lib/validators";
import { db } from "./db";
import { flats, rentTime } from "./db/schema";
import { eq } from "drizzle-orm";

export default async function updateUnit(data: z.infer<typeof flatSchema>) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Du bist nicht berechtigt.", { cause: 401 });

    const valid = flatSchema.safeParse(data);
    if (!valid.success)
      throw new Error("Bitte stelle korrekte Daten zur Verfügung.", {
        cause: 500,
      });

    const { activeTenant, size, type, id } = valid.data;

    if (activeTenant) {
      const tenantAlreadyInOtherUnit = await db.query.flats.findFirst({
        where: (flats, { eq }) => eq(flats.activeTenantId, activeTenant),
      });
      if (tenantAlreadyInOtherUnit?.id !== id)
        throw new Error("Dieser Mieter mietet bereits eine andere Wohnung.", {
          cause: 500,
        });
      await db.insert(rentTime).values({
        movedIn: new Date().toString(),
        flatId: id,
        tenantId: activeTenant,
      });
    }

    await db
      .update(flats)
      .set({ activeTenantId: activeTenant, size, type })
      .where(eq(flats.id, id));

    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message, cause: error.cause };
    }
  }
}
