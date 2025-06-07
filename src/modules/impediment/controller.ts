import { RequestHandler } from "express";
import { impedimentSchema } from "./validator";
import { createImpedimentService } from "./service";
import { CreateImpedimentDTO } from "./dto/createImpediment.dto";
import { findScheduleByIdService } from "../schedule/service";

export const createImpediment: RequestHandler = async(req, res): Promise<any> => {
    try{
        const safeData = impedimentSchema.safeParse(req.body);
        if (!safeData.success) {
            return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        }
        
        const verifySchedule = await findScheduleByIdService(safeData.data.scheduleId as number)

        if(!verifySchedule) return res.status(200).json({ message: "Não foi identificado nenhum agendamento." })

        const impediment = {
            info: safeData.data.info,
            userId: safeData.data.userId,
            scheduleId: safeData.data.scheduleId
        } as CreateImpedimentDTO

        const data = await createImpedimentService(impediment)

        if(!data) return res.status(400).json({ message: "Não foi possível criar sua solicitação" })
        
        return res.status(201).json({ message: "Solicitação de troca criada com sucesso." })
    }catch(error){
        if(error instanceof Error){
            console.error(error.message)
        }
    }
}