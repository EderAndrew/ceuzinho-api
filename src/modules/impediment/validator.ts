import z from "zod";

export const impedimentSchema = z.object({
    id: z.number().optional(),
    info: z.string().max(200),
    userId: z.number().optional(),
    scheduleId: z.number().optional(),
    createdAt: z.date().optional(),
})