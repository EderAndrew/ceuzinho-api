import { z } from 'zod';

export const createScheduleSchema = z.object({
    id: z.number().optional(),
    date: z.date(),
    timeStart: z.string().optional(),
    timeEnd: z.string().optional(),
    period: z.string().optional(),
    scheduleType: z.string(),
    tema: z.string(),
    info: z.string().optional(),
    createdBy: z.number(),
    teatcherOne: z.number().optional(),
    teatcherTwo: z.number().optional(),
    ministratorOne: z.string().optional(),
    ministratorTwo: z.string().optional(),
    document: z.string().optional(),
    updatedAt: z.date().optional()
})