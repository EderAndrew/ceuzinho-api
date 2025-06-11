import { Room } from '@prisma/client';
import { z } from 'zod';

export const createScheduleSchema = z.object({
    id: z.number().optional(),
    date: z.string().optional(),
    timeStart: z.string().optional(),
    timeEnd: z.string().optional(),
    bgColor: z.string().optional(),
    period: z.string().optional(),
    scheduleType: z.string().optional(),
    room: z.nativeEnum(Room).optional(),
    tema: z.string(),
    info: z.string().optional(),
    createdBy: z.number().optional(),
    teatcherOne: z.number().optional(),
    teatcherTwo: z.number().optional(),
    ministratorOne: z.string().optional(),
    ministratorTwo: z.string().optional(),
    document: z.string().optional(),
    documentUrl: z.string().optional(),
    updatedAt: z.date().optional()
})