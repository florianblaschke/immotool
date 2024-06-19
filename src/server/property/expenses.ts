"use server";

import { expensesSchema } from "@/lib/validators";
import { type z } from "zod";
import { getServerAuthSession } from "../auth";
import { db } from "../db";
import { property } from "../db/schema";
import { eq } from "drizzle-orm";

export async function updateExpenses({
  data,
  id,
}: {
  data: z.infer<typeof expensesSchema>;
  id: number | undefined;
}) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Du bist nicht berechtigt.");

    const valid = expensesSchema.safeParse(data);
    if (!valid.success || !id) throw new Error("No data");

    const propertyToUpdate = await db.query.property.findFirst({
      where: (property, { eq }) => eq(property.id, id),
    });

    if (!propertyToUpdate) throw new Error("Die Einheit existiert nicht");

    const { basicFee, sewage, waste, water } = valid.data;
    await db
      .update(property)
      .set({ basicFee, waste, water, sewage })
      .where(eq(property.id, id));

    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message, cause: error.cause };
    }
  }
}
