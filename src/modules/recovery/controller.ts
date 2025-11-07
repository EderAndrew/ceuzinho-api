import { RequestHandler } from "express";
import { findUserByEmailService } from "../users/service";
import { compare, hashSync } from "bcrypt";
import { sendEmail } from "./utils/recoveryUtils";
import { changePasswordWithOTCService, createRecoveryService, selectRecoveryService, updateRecoveryService } from "./service";
import { createRecoveryDTO } from "./dto/recovery.dto";
import { createOtcSchema, verifyOtcSchema, changePasswordSchema } from "./validator";
import { differenceInMinutes } from "date-fns";
import { createJWT } from "../../middlewares/jwt";
import z from "zod";
import { generateOTCCode, calculateExpirationDate } from "../users/utils/userUtils";
import { RECOVERY_MESSAGES, OTC_CONFIG } from "../users/utils/constants";

export const createOtc: RequestHandler = async(req, res): Promise<any> => {
  try {
    // 1. Validação dos dados de entrada
    const safeData = createOtcSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ 
        error: z.treeifyError(safeData.error).errors[0] 
      });
    }
    
    // 2. Verificação de usuário existente e ativo
    const user = await findUserByEmailService(safeData.data.email);
    if (!user?.status) {
      return res.status(404).json({ 
        message: RECOVERY_MESSAGES.USER_NOT_FOUND 
      });
    }

    // 4. Geração do código OTC
    let otcCode = generateOTCCode();

    // 5. Verificação de recovery existente
    const existingRecovery = await selectRecoveryService(safeData.data.email);

    if (existingRecovery) {
      // 6a. Atualização de recovery existente
      const verifyOTC = await compare(otcCode.toString(), existingRecovery.otc);
      
      // Gera novo código se o atual for igual
      if (verifyOTC) {
        otcCode = generateOTCCode();
      }

      // Envio de email
      const emailMessage = `Esse é o seu código para confirmar e trocar a senha: ${otcCode}`;
      const emailResult = await sendEmail(safeData.data.email, emailMessage);

      if (!emailResult.response) {
        return res.status(404).json({ 
          message: RECOVERY_MESSAGES.OTC_SENT_FAILED 
        });
      }

      // Atualização do recovery
      const hashedOtc = hashSync(otcCode.toString(), OTC_CONFIG.SALT_ROUNDS);
      const updatedRecovery = await updateRecoveryService(existingRecovery.id, hashedOtc);

      if (!updatedRecovery) {
        return res.status(500).json({ 
          message: RECOVERY_MESSAGES.OTC_NOT_REGISTERED 
        });
      }

      return res.status(200).json({ 
        message: RECOVERY_MESSAGES.OTC_SENT_SUCCESS 
      });
    }

    // 6b. Criação de novo recovery
    const emailMessage = `Esse é o seu código para confirmar e trocar a senha: ${otcCode}`;
    const emailResult = await sendEmail(safeData.data.email, emailMessage);

    if (!emailResult.response) {
      return res.status(200).json({ 
        message: RECOVERY_MESSAGES.OTC_SENT_FAILED 
      });
    }

    // Criação do payload para novo recovery
    const hashedOtc = hashSync(otcCode.toString(), OTC_CONFIG.SALT_ROUNDS);
    const recoveryPayload = {
      expiresAt: calculateExpirationDate(),
      userEmail: safeData.data.email,
      otc: hashedOtc
    } as createRecoveryDTO;

    const newRecovery = await createRecoveryService(recoveryPayload);

    if (!newRecovery) {
      return res.status(500).json({ 
        message: RECOVERY_MESSAGES.OTC_CODE_NOT_REGISTERED 
      });
    }

    return res.status(201).json({ 
      message: RECOVERY_MESSAGES.OTC_CODE_SENT_SUCCESS 
    });

  } catch (error) {
    console.error('Erro no sendotc:', error);
    
    // Tratamento específico para erros de validação Zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: z.treeifyError(error).errors[0] 
      });
    }

    // Tratamento para outros tipos de erro
    return res.status(500).json({ 
      message: "Erro interno do servidor.",
      ...(process.env.NODE_ENV === 'development' && { 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      })
    });
  }
};

export const verifyOTC: RequestHandler = async(req, res): Promise<any> => {
  try {
    // 1. Validação dos dados de entrada
    const safeData = verifyOtcSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ 
        error: z.treeifyError(safeData.error).errors[0] 
      });
    }

    // 2. Busca do recovery pelo email
    const recovery = await selectRecoveryService(safeData.data.email);
    if (!recovery) {
      return res.status(404).json({ 
        message: RECOVERY_MESSAGES.USER_NOT_FOUND_VERIFY, 
        tokenOTC: null 
      });
    }

    // 3. Verificação do código OTC
    const verifyOtc = await compare(safeData.data.otc as string, recovery.otc);
    if (!verifyOtc) {
      return res.status(400).json({ 
        message: RECOVERY_MESSAGES.OTC_INVALID, 
        tokenOTC: null 
      });
    }

    // 4. Verificação de expiração
    const currentDate = new Date();
    const expirationDifference = differenceInMinutes(currentDate, recovery.expiresAt);

    if (expirationDifference >= OTC_CONFIG.EXPIRATION_MINUTES) {
      return res.status(400).json({ 
        message: RECOVERY_MESSAGES.OTC_EXPIRED, 
        tokenOTC: null 
      });
    }

    // 5. Geração do token JWT
    const token = createJWT({ id: recovery.id });
    console.log("TOKEN: ", token)
    return res.status(200).json({ 
      message: RECOVERY_MESSAGES.OTC_VERIFIED_SUCCESS, 
      tokenOTC: token 
    });

  } catch (error) {
    console.error('Erro no verifyOTC:', error);
    
    // Tratamento específico para erros de validação Zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: z.treeifyError(error).errors[0] 
      });
    }

    // Tratamento para outros tipos de erro
    return res.status(500).json({ 
      message: "Erro interno do servidor.",
      ...(process.env.NODE_ENV === 'development' && { 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      })
    });
  }
};

export const changePasswordWithOTC: RequestHandler = async(req, res): Promise<any> => {
  try {
    // 1. Validação dos dados de entrada
    const safeData = changePasswordSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ 
        error: z.treeifyError(safeData.error).errors[0] 
      });
    }
    const { email, password, repeatPassword } = safeData.data;

    // 2. Verificação de senhas
    if (safeData.data.password !== repeatPassword) {
      return res.status(400).json({ 
        message: RECOVERY_MESSAGES.PASSWORD_NOT_MATCH 
      });
    }

    // 3. Verificação de senhas
    if (password.length < 6) {
      return res.status(400).json({ 
        message: RECOVERY_MESSAGES.PASSWORD_TOO_SHORT 
      });
    }
    
    const user = await findUserByEmailService(email);
    if (!user) {
      return res.status(404).json({ 
        message: RECOVERY_MESSAGES.USER_NOT_FOUND 
      });
    }
    
    const isNewPasswordSameAsOld = await compare(password, user.password);
    if (isNewPasswordSameAsOld) {
      return res.status(400).json({ message: "Senha não pode ser igual à senha antiga." });
    }

    // 4. Mudança de senha
    const newHashedPassword = hashSync(password, 10);
    const changedPassword = await changePasswordWithOTCService(email, newHashedPassword);
    if (!changedPassword) {
      return res.status(500).json({ 
        message: RECOVERY_MESSAGES.PASSWORD_CHANGE_FAILED 
      });
    }

    return res.status(200).json({ 
      message: RECOVERY_MESSAGES.PASSWORD_CHANGED_SUCCESS 
    });  
  } catch (error) {
  console.error('Erro no changePasswordWithOTC:', error);
  
  // Tratamento específico para erros de validação Zod
  if (error instanceof z.ZodError) {
    return res.status(400).json({ 
      error: z.treeifyError(error).errors[0] 
    });
  }
}}