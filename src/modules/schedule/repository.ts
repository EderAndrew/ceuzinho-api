import { Period, PrismaClient } from "@prisma/client";
import { CreateScheduleDTO } from "./dto/createSchedule.dto";


const prisma = new PrismaClient

export const createSchedule = async (payload: CreateScheduleDTO) => {
    const schedule = await prisma.schedule.create({
        data: {
            date: new Date(payload.date),
            timeStart: payload.timeStart,
            timeEnd: payload.timeEnd,
            period: payload.period as Period,
            scheduleType: payload.scheduleType,
            bgColor: payload.bgColor,
            room: payload.room,
            tema: payload.tema,
            info: payload.info,
            createdBy: payload.createdBy,
            teatcherOne: payload.teatcherOne,
            teatcherTwo: payload.teatcherTwo,
            document: payload.document ? payload.document : null,
            documentUrl: payload.documentUrl ? payload.documentUrl : null
        }
    })

    return schedule
}

export const findSchedulesByDate = async (date: string) => {
    const schedules = await prisma.schedule.findMany({
        where: {
            date: {
                gte: new Date(`${date}T00:00:00.000Z`),
                lte: new Date(`${date}T23:59:59.000Z`)
            }
        }
    })
    
    return schedules
}