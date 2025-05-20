import { z } from 'zod';
import { Role } from '../../../generated/prisma';

export const createUserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string(),
  photo: z.string().optional(),
  role: z.nativeEnum(Role).optional()
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
}).strict();