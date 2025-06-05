import { Period, PrismaClient } from "@prisma/client";
import { CreateScheduleDTO } from "./dto/createSchedule.dto";


const prisma = new PrismaClient

export const createSchedule = async (payload: CreateScheduleDTO) => {
    const schedule = await prisma.schedule.create({
        data: {
            date: payload.date,
            timeStart: payload.timeStart,
            timeEnd: payload.timeEnd,
            period: payload.period as Period,
            scheduleType: payload.scheduleType,
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