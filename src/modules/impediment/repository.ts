import { prisma } from "../../lib/prisma";
import { CreateImpedimentDTO } from "./dto/createImpediment.dto";


export const createImpediment = async(payload: CreateImpedimentDTO) => {
    return await prisma.impediment.create({
        data: {
            info: payload.info,
            status: "AGUARDANDO",
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

export const findAllImpediments = async () => {
    return await prisma.impediment.findMany()
}