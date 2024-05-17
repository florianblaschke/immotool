"use server";

import { tenantSchema } from "@/lib/validators";
import { type z } from "zod";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { tenants } from "./db/schema";

export async function getAllTenants() {
  try {
    const tenants = await db.query.tenants.findMany();
    return { message: "success", body: tenants };
  } catch (error) {
    if (error instanceof Error)
      return { message: "error", error: error.message };
  }
}

export async function createTenant(data: z.infer<typeof tenantSchema>) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Du bist nicht berechtigt.");

    const valid = tenantSchema.safeParse(data);
    if (!valid.success) throw new Error("Fehlerhafte Daten");

    await db.insert(tenants).values({
      ...valid.data,
      movedIn: new Date().toString(),
      movedOut: undefined,
    });

    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message };
    }
  }
}
