import { RequestHandler } from "express";
import { impedimentSchema } from "./validator";
import { createImpedimentService } from "./service";
import { CreateImpedimentDTO } from "./dto/createImpediment.dto";
import { findScheduleByIdService } from "../schedule/service";
import { findUserByIdService } from "../users/service";

export const createImpediment: RequestHandler = async(req, res): Promise<any> => {
    try{
        const { userId } = req.params
        const safeData = impedimentSchema.safeParse(req.body);
        if (!safeData.success) {
            return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        }
        
        const verifySchedule = await findScheduleByIdService(safeData.data.scheduleId as number)

        if(!verifySchedule) return res.status(404).json({ message: "Não foi identificado nenhum agendamento." })
        
        const verifyUser = await findUserByIdService(parseInt(userId))
    
        if(!verifyUser) return res.status(404).json({ message: "Não foi identificado nenhum usuário" })

        const payload = {
            info: safeData.data.info,
            userId: parseInt(userId),
            scheduleId: safeData.data.scheduleId
        } as CreateImpedimentDTO

        const data = await createImpedimentService(payload)

        if(!data) return res.status(400).json({ message: "Não foi possível criar sua solicitação" })
        
        return res.status(201).json({ message: "Solicitação de troca criada com sucesso." })
    }catch(error){
        if(error instanceof Error){
            console.error(error.message)
        }
    }
}