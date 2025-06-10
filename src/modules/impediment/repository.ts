import { PrismaClient } from "@prisma/client";
import { CreateImpedimentDTO } from "./dto/createImpediment.dto";

const prisma = new PrismaClient

export const createImpediment = async(payload: CreateImpedimentDTO) => {
    return await prisma.impediment.create({
        data: {
            info: payload.info,
            requestId: payload.requestId,
            scheduleId: payload.scheduleId
        }
    })
}