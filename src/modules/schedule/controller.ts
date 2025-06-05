import { RequestHandler } from "express";
import { ExtendFileRequest } from "../../lib/types/extendRequest";
import formidable from "formidable";
import { createScheduleSchema } from "./validator";
import sharp from "sharp";

sharp.cache(false)

export const createSchedule: RequestHandler = async(req: ExtendFileRequest, res): Promise<any> => {
    try{
        const ESchedule = {
            date: new Date(req.fields?.date?.[0] as string),
            period: req.fields?.period?.[0],
            timeStart: req.fields?.period?.[0] === "MANHÃ" ? "09:00" : req.fields?.period?.[0] === "TARDE" ? "14:00" : "19:00",
            timeEnd: req.fields?.period?.[0] === "MANHÃ" ? "11:00" : req.fields?.period?.[0] === "TARDE" ? "16:00" : "21:00",
            scheduleType: req.fields?.scheduleType?.[0],
            room: req.fields?.room?.[0],
            tema: req.fields?.tema?.[0],
            createdBy: parseInt(req.fields?.createdBy?.[0] as string),
            teatcherOne: parseInt(req.fields?.teatcherOne?.[0] as string),
            teatcherTwo:parseInt(req.fields?.teatcherTwo?.[0] as string)
        }
        
        const safeData = createScheduleSchema.safeParse(ESchedule)

        if(!safeData.success) return res.status(400).json({ error: safeData.error.flatten().fieldErrors })

        let files = req.files as {[fieldname: string]: formidable.File[]}

        console.log(files.document)
        //Verifica se o arquivo é diferente de pdf
        if(files.document[0].mimetype !== "application/pdf"){
            await sharp(files.document[0].filepath)
             .toFormat("webp")
             .toFile(`./public/media/${files.document[0].originalFilename?.split(".")[0]}.webp`)
        }
        
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