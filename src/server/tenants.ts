"use server";

import { changeTenantSchema, tenantSchema } from "@/lib/validators";
import { type z } from "zod";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { unit, rentContract, tenants } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getAllTenants() {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Du bist nicht berechtigt.");

    const tenants = await db.query.tenants.findMany();
    return { message: "success", body: tenants };
  } catch (error) {
    if (error instanceof Error)
      return { message: "error", error: error.message };
  }
}

export async function getTenantById({ id }: { id: number }) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Du bist nicht berechtigt.");

    const tenant = await db.query.tenants.findFirst({
      where: (tenants, { eq }) => eq(tenants.id, id),
      with: { rentContract: true },
    });
    return { message: "success", body: tenant };
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
    });
    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message };
    }
  }
}

export async function changeTenant(data: z.infer<typeof changeTenantSchema>) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new Error("Du bist nicht berechtigt.", { cause: 401 });

    const valid = changeTenantSchema.safeParse(data);
    if (!valid.success)
      throw new Error("Fehler bei der Dateneingabe", { cause: 500 });

    const oldRent = await db.query.rentContract.findFirst({
      where: (rent, { eq }) =>
        eq(rent.unitId, valid.data.flatId) &&
        eq(rent.tenantId, valid.data.tenantId),
    });
    if (!oldRent)
      throw new Error(
        "Es konnten keine Mietdetails zum vorherigen Mieter gefunden werden",
        { cause: 500 },
      );
    await db.transaction(async (tx) => {
      await tx
        .update(rentContract)
        .set({ movedOut: new Date().toString() })
        .where(eq(rentContract.id, oldRent.id));
      await tx
        .update(unit)
        .set({ activeTenantId: valid.data.tenantId })
        .where(eq(unit.id, valid.data.flatId));

      await tx.insert(rentContract).values({
        movedIn: new Date().toString(),
        unitId: valid.data.flatId,
        tenantId: valid.data.tenantId,
        coldRent: valid.data.coldRent,
        utilityRent: valid.data.utilityRent,
      });
    });
    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message };
    }
  }
}
