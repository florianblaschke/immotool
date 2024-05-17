"use server";

import { type z } from "zod";
import { getServerAuthSession } from "./auth";
import { flatSchema } from "@/lib/validators";
import { db } from "./db";
import { flats } from "./db/schema";
import { eq } from "drizzle-orm";

export default async function updateUnit(data: z.infer<typeof flatSchema>) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Du bist nicht berechtigt.");

    const valid = flatSchema.safeParse(data);
    if (!valid.success)
      throw new Error("Bitte stelle korrekte Daten zur Verfügung.");

    const { activeTenant, size, type, id } = valid.data;

    await db
      .update(flats)
      .set({ activeTenantId: activeTenant, size, type })
      .where(eq(flats.id, id));

    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message };
    }
  }
}
