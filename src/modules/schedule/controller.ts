import { RequestHandler } from "express";

export const createSchedule: RequestHandler = async(req, res): Promise<any> => {
    try{

        return res.status(200).json({ message: "Agendamento criado com sucesso." })
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