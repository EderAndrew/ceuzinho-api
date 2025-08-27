import { RequestHandler } from "express";
import { findUserByEmailService } from "../users/service";
import { compare, hashSync } from "bcrypt";
import { sendEmail } from "../../lib/sendEmail";
import { saveRecoveryService, selectRecoveryService, updateRecoveryService } from "./service";
import { createRecoveryDTO } from "./dto/recovery.dto";
import { recoverySchema } from "./validator";
import { differenceInMinutes } from "date-fns";
import { createJWT } from "../../middlewares/jwt";
import z from "zod";

export const sendotc: RequestHandler = async(req, res): Promise<any> => {
  try{
    const safeData = recoverySchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: z.treeifyError(safeData.error).errors[0] });
    }

    if(!safeData.data.email) return res.status(400).json({ message: "Email não informado." })

    const user = await findUserByEmailService(safeData.data.email)

    if(!user?.status) return res.status(404).json({ message: "Usuário não identificado." })
    
    let OTCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000

    const selectRecovery = await selectRecoveryService(safeData.data.email)

    if(selectRecovery){
      const verifyOTC = await compare(OTCode.toString(), selectRecovery.otc);

      if(verifyOTC){
        OTCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
      }

      const msg = `Esse é o seu código para confirmar e trocar a senha: ${OTCode}`
      const email = await sendEmail(safeData.data.email, msg)

      if(!email.response) return res.status(201).json({ message: "Email não enviado." })
      
      const hash = hashSync(OTCode.toString(), 10)
      const recovery = await updateRecoveryService(selectRecovery.id, hash)

      if(!recovery) return res.status(500).json({ message: "OTC não registrado" })
      
      return res.status(200).json({ message: "OTC enviado com sucesso." })
    }

    const msg = `Esse é o seu código para confirmar e trocar a senha: ${OTCode}`
    const email = await sendEmail(safeData.data.email, msg)

    if(!email.response) return res.status(201).json({ message: "Email não enviado." })
    
    const hash = hashSync(OTCode.toString(), 10)

    const payload = {
        expiresAt: new Date(new Date().getTime() + 5 * 60000),
        userEmail: safeData.data.email,
        otc: hash
    } as createRecoveryDTO

    const recovery = await saveRecoveryService(payload)

    if(!recovery) return res.status(500).json({ message: "Código OTC não registrado" })
    
    return res.status(201).json({ message: "Código OTC enviado com sucesso." })
    
  }catch(error){
    if(error instanceof z.ZodError){
      return res.status(500).json({ message: z.treeifyError(error).errors[0] });
    }
  }
}

export const verifyOTC: RequestHandler = async(req, res): Promise<any> => {
    try{
        const safeData = recoverySchema.safeParse(req.body);
        if (!safeData.success) {
            return res.status(400).json({ error: z.treeifyError(safeData.error).errors[0] });
        }

        const selectRecovery = await selectRecoveryService(safeData.data.email)

        if(!selectRecovery) return res.status(404).json({ message: "Não foi encontrado esse usuário.", tokenOTC: null })
            
        const verifyOtc = await compare(safeData.data.otc as string, selectRecovery.otc)

        if(!verifyOtc) return res.status(400).json({ message: "Código OTC não confere.", tokenOTC: null })
        
        const dateNow = new Date()
        const verifyExpiresAt = differenceInMinutes(dateNow, selectRecovery.expiresAt)

        if(verifyExpiresAt >= 5) return res.status(400).json({ message: "Código de recuperação expirou. Tente novamente", tokenOTC: null })

        const token = createJWT({id: selectRecovery.id})
        
        return res.status(200).json({ message: "Troca permitida.", tokenOTC: token })
    }catch(error){
      if(error instanceof z.ZodError){
        return res.status(500).json({ message: z.treeifyError(error).errors[0] });
      }
    }
}