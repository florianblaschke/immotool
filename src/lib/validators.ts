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
  flats: z.coerce.number(),
  commercial: z.coerce.number(),
  heatingSystem: z
    .string()
    .refine((e) => validHeatingSystems.some((sys) => sys === e)),
  capacity: z.coerce.number().min(0).optional(),
});
// .superRefine(({ heatingSystem }, ctx) => {
//   if (heatingSystem === "oil") {
//     ctx.addIssue({
//       code: "too_small",
//       message: "Capacity is required",
//       inclusive: true,
//       minimum: 500,
//       type: "number",
//     });
//   }
// });
//Needs rework. Does not work as intended

export const expensesSchema = z.object({
  waste: z.coerce.number(),
  water: z.coerce.number(),
  basicFee: z.coerce.number(),
  sewage: z.coerce.number(),
});
