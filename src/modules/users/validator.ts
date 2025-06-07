import { Role } from "@prisma/client";
import { z } from 'zod';

export const createUserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().optional(),
  photo: z.string().optional(),
  phone: z.string().optional(),
  sex: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  bgColor: z.string().optional()
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
}).strict();

export const updateUserSchema =  z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  photo: z.string().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
});