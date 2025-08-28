import fs from "fs/promises";
import { RequestHandler } from "express";
import { ExtendFileRequest } from "../../lib/types/extendRequest";
import formidable from "formidable";
import { changeProfessorIdSchema, createScheduleSchema } from "./validator";
import sharp from "sharp";
import path from "path";
import { 
    changeTeacherService,
    createScheduleService,
    deleteScheduleService,
    findScheduleByIdService,
    findScheduleByUserIdService,
    findSchedulesByDateService,
    updateScheduleService
} from "./service";
import { CreateScheduleDTO } from "./dto/createSchedule.dto";
import { verifyDir } from "../../lib/verifyDir";
import { findUserByIdService } from "../users/service";
import z from "zod";
import { 
    getPeriodConfig, 
    getFieldValue, 
    parseNumberField, 
    buildDocumentUrl 
} from "./utils/scheduleUtils";

sharp.cache(false)

export const createSchedule: RequestHandler = async(req: ExtendFileRequest, res): Promise<any> => {
    try{
        const period = getFieldValue(req.fields, 'period');
        const periodConfig = getPeriodConfig(period || 'NOITE'); // fallback para NOITE
        
        const ESchedule = {
            date: getFieldValue(req.fields, 'date'),
            period,
            timeStart: periodConfig.timeStart,
            timeEnd: periodConfig.timeEnd,
            bgColor: periodConfig.bgColor,
            scheduleType: getFieldValue(req.fields, 'scheduleType'),
            room: getFieldValue(req.fields, 'room'),
            tema: getFieldValue(req.fields, 'tema'),
            createdBy: parseNumberField(getFieldValue(req.fields, 'createdBy')),
            teatcherOne: parseNumberField(getFieldValue(req.fields, 'teatcherOne')), // Mantido compatibilidade com DB
            teatcherTwo: parseNumberField(getFieldValue(req.fields, 'teatcherTwo'))  // Mantido compatibilidade com DB
        } as CreateScheduleDTO
        
        const safeData = createScheduleSchema.safeParse(ESchedule)

        if(!safeData.success) return res.status(400).json({ error: z.treeifyError(safeData.error).errors[0] })

        const yesterday = new Date(getFieldValue(req.fields, 'date') as string)
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
                documentUrl: buildDocumentUrl(
                    files.document[0].originalFilename?.split(".")[0] || '',
                    process.env.NODE_ENV === "production",
                    '',
                    true
                )
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
        documentUrl: buildDocumentUrl(
            files.document[0].originalFilename || '',
            process.env.NODE_ENV === "production",
            '',
            false
        )
    }

        await fs.unlink(files.document[0].filepath)

        const schedule = await createScheduleService(formData)

        if(!schedule) return res.status(500).json({ message: "Erro ao criar agendamento." })
        
        return res.status(201).json({ message: "Schedule criado com sucesso" })
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(500).json({ message: z.treeifyError(error).errors[0] });
        }
    }
    
}

export const updateSchedule: RequestHandler = async(req: ExtendFileRequest, res): Promise<any> => {
    try{
        //pegar os dados
        const { id } = req.params
        const period = getFieldValue(req.fields, 'period');
        const periodConfig = getPeriodConfig(period || 'NOITE'); // fallback para NOITE
        
        const ESchedule = {
            period,
            timeStart: periodConfig.timeStart,
            timeEnd: periodConfig.timeEnd,
            bgColor: periodConfig.bgColor,
            scheduleType: getFieldValue(req.fields, 'scheduleType'),
            room: getFieldValue(req.fields, 'room'),
            tema: getFieldValue(req.fields, 'tema')
        } as CreateScheduleDTO

        const safeData = createScheduleSchema.safeParse(ESchedule)

        if(!safeData.success) return res.status(400).json({ error: z.treeifyError(safeData.error).errors[0] })
        //verificar se a schedule existe
        const hasSchedule = await findScheduleByIdService(parseInt(id))

        if(!hasSchedule) return res.status(404).json({ message: "Agendamento não identificado." })
        
        let files = req.files as {[fieldname: string]: formidable.File[]}
        
        if(!files.document) {
            const schedule = await updateScheduleService(parseInt(id), ESchedule)

            if(!schedule) return res.status(500).json({ message: "Erro ao atualziar agendamento." })

            return res.status(201).json({ message: "Agendamento atualizado com sucesso..." })
        }

        if(files.document[0].mimetype !== "application/pdf"){
            const publicDir = path.join(__dirname, "../../../public/media");

            await verifyDir(publicDir)

            await sharp(files.document[0].filepath)
             .toFormat("webp")
             .toFile(`./public/media/${files.document[0].originalFilename?.split(".")[0]}.webp`)

            const formData = { 
                ...ESchedule,
                document: files.document[0].originalFilename?.split(".")[0],
                documentUrl: buildDocumentUrl(
                    files.document[0].originalFilename?.split(".")[0] || '',
                    process.env.NODE_ENV === "production",
                    '',
                    true
                )
            }

            await fs.unlink(files.document[0].filepath)
            await fs.unlink(hasSchedule.documentUrl as string)

            const schedule = await updateScheduleService(parseInt(id), formData)

            if(!schedule) return res.status(500).json({ message: "Erro ao atualizar agendamento." })

            return res.status(201).json({ message: "Agendamento atualizado com sucesso!" })
        }

        const publicDir = path.join(__dirname, "../../../public/files");

        await verifyDir(publicDir)

        const filePath = path.join(publicDir, files.document[0].originalFilename as string);

        await fs.writeFile(filePath, files.document[0].originalFilename as string);

        const formData = { 
            ...ESchedule,
            document: files.document[0].originalFilename?.split(".pdf")[0],
            documentUrl: buildDocumentUrl(
                files.document[0].originalFilename || '',
                process.env.NODE_ENV === "production",
                '',
                false
            )
        }

        await fs.unlink(hasSchedule.documentUrl as string)
        await fs.unlink(files.document[0].filepath)

        const schedule = await updateScheduleService(parseInt(id), formData)

        if(!schedule) return res.status(500).json({ message: "Erro ao criar agendamento." })

        return res.status(200).json({ message: "Agendamento atualizado com sucesso." })
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(500).json({ message: z.treeifyError(error).errors[0] });
        }
    }
    
}

export const deleteSchedule: RequestHandler = async(req, res): Promise<any> => {
    try{
        let { id } = req.params

        const verifySchedule = await findScheduleByIdService(parseInt(id))

        if(!verifySchedule) return res.status(404).json({ message: "Não existe Agendamento." })
        
        await deleteScheduleService(parseInt(id))

        return res.status(200).json({ message: "Agendamento excluido com sucesso." })
    }catch(error){
        console.error(error)
    }
    
}

export const allSchedulesByDate: RequestHandler = async(req, res): Promise<any> => {
    try{
        let { date } = req.params
        const schedules = await findSchedulesByDateService(date)

        if(!schedules) return res.status(404).json({ message: "Agendamentos nao encontrados." , data: [] })
            
        return res.status(200).json({ message: "Agendamentos encontrados com sucesso." , data: schedules })
    }catch(error){
        console.error(error)
    }
    
}

export const scheduleById: RequestHandler = async(req, res): Promise<any> => {
    try{
        let { id } = req.params

        const schedule = await findScheduleByIdService(parseInt(id))

        if(!schedule) return res.status(404).json({ message: "Agendamento nao encontrados." , data: [] })
        
        return res.status(200).json({ message: "Agendamento encontrado com sucesso." , data: schedule })
    }catch(error){
        console.error(error)
    }
}

export const scheduleByUserId: RequestHandler = async(req, res):Promise<any> => {
    try{
        let { id } = req.params

        const schedule = await findScheduleByUserIdService(id)

        if(!schedule) return res.status(404).json({ message: "Agendamento nao encontrados." , data: [] })
        
        return res.status(200).json({ message: "Agendamento encontrado com sucesso." , data: schedule })
    }catch(error){
        console.error(error)
    }
}

export const changeScheduleTeacherId: RequestHandler = async(req, res):Promise<any> => {
    let one = false
    try{
        let {scheduleId} = req.params
        const safeData = changeProfessorIdSchema.safeParse(req.body);
        if (!safeData.success) {
            return res.status(400).json({ error: z.treeifyError(safeData.error).errors[0] });
        }

        const schedule = await findScheduleByIdService(parseInt(scheduleId))

        if(!schedule) return res.status(404).json({ message: "Agendamento nao encontrado."})

        const newTeatcher = await findUserByIdService(safeData.data.newId)

        if(!newTeatcher) return res.status(404).json({ message: "Professor nao encontrado." })

        const oldTeatcher = await findUserByIdService(safeData.data.oldId)

        if(!oldTeatcher) return res.status(404).json({ message: "Professor nao encontrado."})
        
        if(newTeatcher.id === schedule.teatcherOne || newTeatcher.id === schedule.teatcherTwo) return res.status(400).json({ message: "Professor já está vinculado ao agendamento." })
        
        if(newTeatcher.id === oldTeatcher.id) return res.status(404).json({ message: "Você esta tentando trocar o mesmo professor?" })
        
        if(oldTeatcher.id === schedule.teatcherOne){
            one = true
            const first = await changeTeacherService(parseInt(scheduleId), newTeatcher.id, one)

            if(!first) return res.status(400).json({ message: "Não foi possível realizar a troca de professores." })
            
            return res.status(200).json({ message: "Troca de professor efetuada com sucesso" })
        }     

        const first = await changeTeacherService(parseInt(scheduleId), newTeatcher.id, one)

        if(!first) return res.status(400).json({ message: "Não foi possível realizar a troca de professores." })
        
        return res.status(200).json({ message: "Troca de professor efetuada com sucesso" })
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(500).json({ message: z.treeifyError(error).errors[0] });
        }
    }
}

