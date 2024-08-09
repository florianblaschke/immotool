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
const PropertyEnum = newPropertySchema.keyof();
export type NewPropertyTypeKeys = z.infer<typeof PropertyEnum>;

export const flatSchema = z.object({
  id: z.coerce.number(),
  size: z.coerce.number(),
  type: z.enum(["commercial", "normal"]),
  activeTenant: z.coerce.number().optional().nullable(),
  coldRent: z.coerce.number(),
  utilityRent: z.coerce.number(),
});

export type FlatType = z.infer<typeof flatSchema>;

export const tenantSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  coldRent: z.coerce.number(),
  utilityRent: z.coerce.number(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  flatId: z.coerce.number().optional(),
  propertyId: z.coerce.number().optional(),
});

export const counterSchema = z.object({
  type: z.enum(["electricity", "gas", "water"]),
  number: z.string(),
  value: z.coerce.number(),
  valueDate: z.date(),
});

export const expensesSchema = z.object({
  waste: z.coerce.number(),
  water: z.coerce.number(),
  basicFee: z.coerce.number(),
  sewage: z.coerce.number(),
});

export const ExpenseEnum = expensesSchema.keyof();
export type ExpenseEnumType = z.infer<typeof ExpenseEnum>;

export const changeTenantSchema = z.object({
  tenantId: z.coerce.number(),
  flatId: z.coerce.number(),
  coldRent: z.coerce.number(),
  utilityRent: z.coerce.number(),
});

export type ExpensesType = z.infer<typeof expensesSchema>;

export const counterValueSchema = z.object({
  value: z.coerce.number().nonnegative(),
  date: z.date(),
});
