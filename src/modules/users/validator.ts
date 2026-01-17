
import { z } from 'zod';
import { Role } from '../../generated/prisma/enums';

export const createUserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  email: z.email(),
  password: z.string().optional(),
  photo: z.string().optional(),
  phone: z.string().optional(),
  sex: z.string().optional(),
  role: z.enum(Role).optional(),
  bgColor: z.string().optional()
});

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
}).strict();

export const changePasswordSchema = z.object({
  email: z.email(),
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
  repeatePassword: z.string().min(6)
})

export const updateUserSchema =  z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  password: z.string().optional(),
  photo: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(Role).optional(),
  status: z.boolean().optional()
});