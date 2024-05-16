import { ActionError } from "@/lib/utils";
import { getServerAuthSession } from "./auth";
import { db } from "./db";

export async function getTenantsForProperty(id: number) {
  try {
    const session = await getServerAuthSession();
    if (!session) throw new ActionError("unauthorized", { code: 401 });

    const property = await db.query.property.findFirst({
      where: (property, { eq }) => eq(property.id, id),
      with: { tenants: true },
    });

    return { message: "success", body: property?.tenants };
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message };
    }
    if (error instanceof ActionError) {
      if (error.cause === 401) {
        return { message: "error", error: "Du bist nicht berechtigt." };
      }
    }
  }
}
