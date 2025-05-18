import { z } from 'zod';
import { Role } from '../../../generated/prisma';

export const createUserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string({ message: "Senha é obrigatoria." }).min(6, { message: "Senha deve ter pelo menos 6 caracteres." }),
  photo: z.string().optional(),
  role: z.nativeEnum(Role)
});