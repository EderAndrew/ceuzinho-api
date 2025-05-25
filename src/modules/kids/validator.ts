import { z } from 'zod';
import { Room } from '../../../generated/prisma';

export const createKidSchema = z.object({
  id: z.number().optional(),
  photo: z.string().optional(),
  name: z.string().min(1),
  age: z.number(),
  birthDate: z.date(),
  room: z.nativeEnum(Room).optional(),
  user_id: z.number(),
});