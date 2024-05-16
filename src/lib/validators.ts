import { z } from "zod";

export const validHeatingSystems = ["heatpump", "oil", "gas", "districtheat"];

export const newPropertySchema = z.object({
  street: z.string(),
  streetNumber: z.string(),
  city: z.string(),
  zipCode: z.coerce
    .number()
    .min(10000, { message: "Please provide a valid zipCode." })
    .max(99999, { message: "Please provide a valid zipCode." }),
  units: z.coerce.number(),
  commercial: z.coerce.number(),
  heatingSystem: z
    .string()
    .refine((e) => validHeatingSystems.some((sys) => sys === e)),
  capacity: z.coerce.number().min(0).optional(),
});

export type NewPropertyType = z.infer<typeof newPropertySchema>;

export const flatSchema = z.object({
  size: z.coerce.number(),
  type: z.enum(["commercial", "normal"]),
  activeTenant: z.string(),
});

export type FlatType = z.infer<typeof flatSchema>;

export const tenantSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  coldrent: z.coerce.number().min(1),
  utilityRent: z.coerce.number().min(1),
  movedIn: z.date().optional(),
  movedOut: z.date().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email(),
});

export const expensesSchema = z.object({
  waste: z.coerce.number(),
  water: z.coerce.number(),
  basicFee: z.coerce.number(),
  sewage: z.coerce.number(),
});

export type ExpensesType = z.infer<typeof expensesSchema>;
