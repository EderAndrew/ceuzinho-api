import fs from "fs/promises";
import { RequestHandler } from "express";
import { ExtendFileRequest } from "../../lib/types/extendRequest";
import formidable from "formidable";
import { createScheduleSchema } from "./validator";
import sharp from "sharp";
import path from "path";
import { createScheduleService, findScheduleByIdService, findScheduleByUserIdService, findSchedulesByDateService } from "./service";
import { CreateScheduleDTO } from "./dto/createSchedule.dto";
import { verifyDir } from "../../lib/verifyDir";

sharp.cache(false)

export const createSchedule: RequestHandler = async(req: ExtendFileRequest, res): Promise<any> => {
    try{
        const ESchedule = {
            date: req.fields?.date?.[0],
            period: req.fields?.period?.[0],
            timeStart: req.fields?.period?.[0] === "MANHÃ" ? "09:00" : req.fields?.period?.[0] === "TARDE" ? "14:00" : "19:00",
            timeEnd: req.fields?.period?.[0] === "MANHÃ" ? "11:00" : req.fields?.period?.[0] === "TARDE" ? "16:00" : "21:00",
            bgColor: req.fields?.period?.[0] === "MANHÃ" ? "#EBBC16" : req.fields?.period?.[0] === "TARDE" ? "#7A9B44" : "#043A68",
            scheduleType: req.fields?.scheduleType?.[0],
            room: req.fields?.room?.[0],
            tema: req.fields?.tema?.[0],
            createdBy: parseInt(req.fields?.createdBy?.[0] as string),
            teatcherOne: parseInt(req.fields?.teatcherOne?.[0] as string),
            teatcherTwo:parseInt(req.fields?.teatcherTwo?.[0] as string)
        } as CreateScheduleDTO
        
        const safeData = createScheduleSchema.safeParse(ESchedule)

        if(!safeData.success) return res.status(400).json({ error: safeData.error.flatten().fieldErrors })

        const yesterday = new Date(req.fields?.date?.[0] as string)
        const today = new Date()
        
        if(yesterday <= today) return res.status(200).json({message: "Data deve ser maior que a data atual."})
        
        let files = req.files as {[fieldname: string]: formidable.File[]}

        //Save informations with out document
        if(!files.document) {
            const schedule = await createScheduleService(ESchedule)

            if(!schedule) return res.status(500).json({ message: "Erro ao criar agendamento." })

            return res.status(201).json({ message: "Schedule criado com sucesso..." })
        }

        //Verifica se o arquivo é diferente de pdf
        if(files.document[0].mimetype !== "application/pdf"){
            const publicDir = path.join(__dirname, "../../../public/media");

            await verifyDir(publicDir)

            await sharp(files.document[0].filepath)
             .toFormat("webp")
             .toFile(`./public/media/${files.document[0].originalFilename?.split(".")[0]}.webp`)

            const formData = { 
                ...ESchedule,
                document: files.document[0].originalFilename?.split(".")[0],
                documentUrl: process.env.NODE_ENV === "production"
                ? `${process.env.URL_DOC_PROD}media/${files.document[0].originalFilename?.split(".")[0]}.webp`
                : `${process.env.URL_DOC_DEV}media/${files.document[0].originalFilename?.split(".")[0]}.webp`
            }

            await fs.unlink(files.document[0].filepath)

            const schedule = await createScheduleService(formData)

            if(!schedule) return res.status(500).json({ message: "Erro ao criar agendamento." })

            return res.status(201).json({ message: "Schedule criado com sucesso!" })
        }

        const publicDir = path.join(__dirname, "../../../public/files");

        await verifyDir(publicDir)

        const filePath = path.join(publicDir, files.document[0].originalFilename as string);

        await fs.writeFile(filePath, files.document[0].originalFilename as string);

        const formData = { 
            ...ESchedule,
            document: files.document[0].originalFilename?.split(".pdf")[0],
            documentUrl: process.env.NODE_ENV === "production"
            ? `${process.env.URL_DOC_PROD}files/${files.document[0].originalFilename}`
            : `${process.env.URL_DOC_DEV}files/${files.document[0].originalFilename}`
        }

        await fs.unlink(files.document[0].filepath)

        const schedule = await createScheduleService(formData)

        if(!schedule) return res.status(500).json({ message: "Erro ao criar agendamento." })
        
        return res.status(201).json({ message: "Schedule criado com sucesso" })
    }catch(error){
        if(error instanceof Error){
            console.log(error.message)
        }
    }
    
}

export const updateSchedule: RequestHandler = async(req, res): Promise<any> => {
    try{
        //pegar os dados
        //verificar se a schedule existe
        //Editar as informações
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

export const allSchedulesByDate: RequestHandler = async(req, res): Promise<any> => {
    try{
        let { date } = req.params
        const schedules = await findSchedulesByDateService(date)

        if(!schedules) return res.status(404).json({ message: "Agendamentos nao encontrados." , data: [] })
            
        return res.status(200).json({ message: "Agendamentos encontrados com sucesso." , data: schedules })
    }catch(error){
        if(error instanceof Error){
            console.log(error.message)
        }
    }
    
}

export const scheduleById: RequestHandler = async(req, res): Promise<any> => {
    try{
        let { id } = req.params

        const schedule = await findScheduleByIdService(parseInt(id))

        if(!schedule) return res.status(404).json({ message: "Agendamento nao encontrados." , data: [] })
        
        return res.status(200).json({ message: "Agendamento encontrado com sucesso." , data: schedule })
    }catch(error){
        if(error instanceof Error){
            console.log(error.message)
        }
    }
}

export const scheduleByUserId: RequestHandler = async(req, res):Promise<any> => {
    try{
        let { id } = req.params

        const schedule = await findScheduleByUserIdService(id)

        if(!schedule) return res.status(404).json({ message: "Agendamento nao encontrados." , data: [] })
        
        return res.status(200).json({ message: "Agendamento encontrado com sucesso." , data: schedule })
    }catch(error){
        if(error instanceof Error){
            console.error(error.message)
        }
    }
}

