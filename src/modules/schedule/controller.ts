import { RequestHandler } from "express";
import { ExtendFileRequest } from "../../lib/types/extendRequest";
import formidable from "formidable";

export const createSchedule: RequestHandler = async(req: ExtendFileRequest, res): Promise<any> => {
    try{
        const ESchedule = req.files as { [fieldname: string]: formidable.File[] };
        console.log(ESchedule)
        return res.status(200).json({ message: "Schedule criado com sucesso" })
    }catch(error){
        if(error instanceof Error){
            console.log(error.message)
        }
    }
    
}

export const updateSchedule: RequestHandler = async(req, res): Promise<any> => {
    try{

        return res.status(200).json({ message: "Agendamento atualizado com sucesso." })
    }catch(error){
        if(error instanceof Error){
            console.log(error.message)
        }
    }
    
}

export const deleteSchedule: RequestHandler = async(req, res): Promise<any> => {
    try{

        return res.status(200).json({ message: "Agendamento excluido com sucesso." })
    }catch(error){
        if(error instanceof Error){
            console.log(error.message)
        }
    }
    
}   