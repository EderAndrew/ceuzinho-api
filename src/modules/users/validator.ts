import { Role } from "@prisma/client";
import { z } from 'zod';

export const createUserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string(),
  photo: z.string().optional(),
  phone: z.string().optional(),
  sex: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  bgColor: z.string().optional()
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
}).strict();