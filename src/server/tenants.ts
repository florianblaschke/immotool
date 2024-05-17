"use server";

import { ActionError } from "@/lib/utils";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { type z } from "zod";
import { tenantSchema } from "@/lib/validators";
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
    if (!session) throw new ActionError("unauthorized", { code: 401 });

    const valid = tenantSchema.safeParse(data);
    if (!valid.success) throw new ActionError("invalid data", { code: 500 });

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
    if (error instanceof ActionError) {
      if (error.cause === 401) {
        return { message: "error", error: "Du bist nicht berechtigt." };
      }
      if (error.cause === 500) {
        return { message: "error", error: "Fehler bei der Dateneingabe." };
      }
    }
  }
}
