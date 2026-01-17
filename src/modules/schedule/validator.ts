
import { z } from 'zod';
import { Room } from '../../generated/prisma/enums';

export const createScheduleSchema = z.object({
    id: z.number().optional(),
    date: z.string().optional(),
    month: z.string().optional(),
    timeStart: z.string().optional(),
    timeEnd: z.string().optional(),
    bgColor: z.string().optional(),
    period: z.string().optional(),
    scheduleType: z.string().optional(),
    room: z.enum(Room).optional(),
    tema: z.string(),
    info: z.string().optional(),
    createdBy: z.number().optional(),
    teacherOne: z.number().optional(),
    teacherTwo: z.number().optional(),
    ministratorOne: z.string().optional(),
    ministratorTwo: z.string().optional(),
    document: z.string().optional(),
    documentUrl: z.string().optional(),
    updatedAt: z.date().optional()
})

export const changeProfessorIdSchema = z.object({
    newId: z.number(),
    oldId: z.number()
})