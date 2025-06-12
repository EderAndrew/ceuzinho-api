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

export const selectImpediment = async (id: number) => {
    return await prisma.impediment.findFirst({
        where: {
            id
        }
    })
}

export const updateImpediment = async (id: number, userId: number) => {
    return await prisma.impediment.update({
        where: {
            id
        },
        data: {
            acceptId: userId,
            status: "ACEITO",
            updatedAt: new Date()
        }
    })
}

export const cancelImpediment = async (id: number) => {
    return await prisma.impediment.update({
        where: {
            id
        },
        data: {
            status: "CANCELADO",
            updatedAt: new Date()
        }
    })
}