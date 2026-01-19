import { z } from 'zod';
import { Room } from '../../generated/prisma/enums';


export const createKidSchema = z.object({
  id: z.number().optional(),
  photo: z.string().optional(),
  name: z.string().min(1),
  age: z.number(),
  birthDate: z.date(),
  room: z.enum(Room).optional()
});