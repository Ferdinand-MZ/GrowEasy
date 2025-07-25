import { z } from "zod";

export const accountSchema = z.object({
    name: z.string().min(1, "Account name is required"),
    type: z.enum(["CURRENT", "SAVINGS"]),
    balance: z.string().min(0, "initial balance is required"),
    isDefault: z.boolean().default(false),

})