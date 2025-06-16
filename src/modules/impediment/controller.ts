import { RequestHandler } from "express";
import { impedimentSchema } from "./validator";
import { cancelImpedimentService, createImpedimentService, selectImpedimentService, updateImpedimentService } from "./service";
import { CreateImpedimentDTO } from "./dto/createImpediment.dto";
import { changeTeacherService, findScheduleByIdService, findScheduleByUserIdService } from "../schedule/service";
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

        const checkScheduleByUser = await findScheduleByUserIdService(userId)

        if(!checkScheduleByUser) return res.status(404).json({ message: "Esse usuário não esta nesse agendamento." })

        const payload = {
            info: safeData.data.info,
            requestId: parseInt(userId),
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

export const updateImpediment: RequestHandler = async(req, res):Promise<any> => {
    try{
        let { id } = req.params
        let userId = req.body.userId

        //verificar se o impedimento existe
        const hasImpediment = await selectImpedimentService(parseInt(id))

        if(!hasImpediment) return res.status(404).json({ message: "Não existe nenhum impedimento com essa ID" })
        
        //Verifica se o usuário não é o solicitante
        const verifyUser = hasImpediment.requestId === userId

        if(verifyUser) return res.status(200).json({ message: "Você mesmo requisitou esse impedimento." })
        
        //Verifica se esse mesmo usuário já não respondeu a solicitação
        const justUser = hasImpediment.acceptId === userId

        if(justUser) return res.status(200).json({ message: "Você já respondeu a esse impedimento." })
        //verific se o impedimento foi cancelado
        if(hasImpediment.status === "CANCELADO") return res.status(200).json({ message: "Esse impedimento esta cancelado." })
        
        //verifica se o impedimento já não foi respondido.
        if(hasImpediment.status === "ACEITO") return res.status(200).json({ message: "Esse impedimento já foi aceito por algum outro professor." })
        
        //verifico no schedule se o professor solicitante é o professor 1 ou o 2
        const schedule = await findScheduleByIdService(hasImpediment.scheduleId)
        
        if(schedule?.teatcherOne === userId || schedule?.teatcherTwo === userId) return res.status(200).json({ message: "Professor já esta nessa agendamento." })
        
        const accept = await updateImpedimentService(parseInt(id), userId)

        if(!accept) return res.status(404).json({ message: "Não foi possível salvar as informações" })
        const firstOrSecond = schedule?.teatcherOne === hasImpediment.requestId ? true : false
    
        const changeTeacher = await changeTeacherService(hasImpediment.scheduleId, userId, firstOrSecond)

        if(!changeTeacher) return res.status(404).json({ message: "Problema para trocar de professor." })
        
        return res.status(200).json({ message: "Solicitação respondida com sucesso." })
        
    }catch(error){
        console.error(error)
    }
}

export const selectImpediment: RequestHandler = async(req, res): Promise<any> => {
    try{
        const { id } = req.params

        const hasImpediment = await selectImpedimentService(parseInt(id))

        if(!hasImpediment) return res.status(404).json({ message: "Não existe nenhum impedimento com essa ID" })
        
        return res.status(200).json({ message: "Impedimento selecionado com sucesso.", data: hasImpediment })
    }catch(error){
        console.error(error)
    }
}

export const allImpediments: RequestHandler = async(req, res): Promise<any> => {
    try{
        const impediments = await findAllImpedimentsService()

        return res.status(200).json({ message:"Impedimentos encontrados com sucesso.", data: impediments })
    }catch(error){
        console.error(error)
    }
}

export const removeImpediment: RequestHandler = async(req, res): Promise<any> => {
    try{
        const {id} = req.params

        const hasImpediment = await selectImpedimentService(parseInt(id))

        if(!hasImpediment) return res.status(404).json({ message: "Não existe nenhum impedimento com essa ID" })
        
        await cancelImpedimentService(parseInt(id))

        return res.status(200).json({ message: "Impedimento cancelado com sucesso." })

    }catch(error){
        console.error(error)
    }
}