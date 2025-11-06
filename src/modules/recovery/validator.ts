import z from "zod";

// Schema para criar OTC - apenas email necessário
export const createOtcSchema = z.object({
  email: z.string().email()
});

// Schema para verificar OTC - email e otc necessários
export const verifyOtcSchema = z.object({
  email: z.string().email(),
  otc: z.string()
});

// Schema para mudar senha - email, password e repeatPassword necessários
export const changePasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  repeatPassword: z.string().min(6)
});

// Schema genérico mantido para compatibilidade (se necessário)
export const recoverySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
  repeatPassword: z.string().min(6).optional(),
  otc: z.string().optional()
})
