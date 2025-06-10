import z from "zod";

export const recoverySchema = z.object({
  email: z.string().email(),
  otc: z.string().optional()
})
