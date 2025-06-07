import { PrismaClient } from "@prisma/client";
import { CreateImpedimentDTO } from "./dto/createImpediment.dto";

const prisma = new PrismaClient

export const create = async(payload: CreateImpedimentDTO) => {
    return await prisma.impediment.create({
        data: {
            info: payload.info,
            userId: payload.userId,
            scheduleId: payload.scheduleId
        }
    })
}