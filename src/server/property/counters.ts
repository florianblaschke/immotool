"use server";

import { counterSchema } from "@/lib/validators";
import type { z } from "zod";
import { getServerAuthSession } from "../auth";
import { db } from "../db";
import { counter, counterValues } from "../db/schema";

export async function createCounter({
  data,
  propertyId,
}: {
  data: Pick<z.infer<typeof counterSchema>, "type" | "number">;
  propertyId: number | undefined;
}) {
  try {
    const session = await getServerAuthSession();
    if (!session)
      throw new Error("Du bist hierfür nicht berechtigt", { cause: 401 });

    const valid = counterSchema
      .partial({ value: true, valueDate: true })
      .safeParse(data);
    if (!valid.success || !propertyId)
      throw new Error("Die Daten sind ungültig", { cause: 500 });

    const { number, type } = valid.data;

    await db.insert(counter).values({
      number,
      type,
      propertyId,
    });
    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error, error: error.message };
    }
  }
}

export async function setCounterValue({
  data,
}: {
  data: Pick<z.infer<typeof counterSchema>, "value" | "valueDate" | "number">;
}) {
  try {
    const session = await getServerAuthSession();
    if (!session)
      throw new Error("Du bist hierfür nicht berechtigt", { cause: 401 });

    const valid = counterSchema.safeParse(data);
    if (!valid.success)
      throw new Error("Die Daten sind ungültig", { cause: 500 });

    const { number, valueDate, value } = valid.data;

    const counterToUpdate = await db.query.counter.findFirst({
      where: (counter, { eq }) => eq(counter.number, number),
    });

    if (!counterToUpdate)
      throw new Error("Keinen Zähler mit der angegeben Nummer gefunden", {
        cause: 500,
      });

    await db.insert(counterValues).values({
      counterValuesId: counterToUpdate.id,
      value,
      valueDate: valueDate.getTime().toString(),
    });

    return { message: "success" };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error, error: error.message };
    }
  }
}

export async function getCounterById({ number }: { number: string }) {
  try {
    const session = await getServerAuthSession();
    if (!session)
      throw new Error("Du bist hierfür nicht berechtigt", { cause: 401 });

    const counter = await db.query.counter.findFirst({
      where: (counter, { eq }) => eq(counter.number, number),
    });

    return counter;
  } catch (error) {
    if (error instanceof Error) {
      return { message: "error", error: error.message };
    }
  }
}
