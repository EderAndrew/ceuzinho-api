import { PrismaClient } from "@prisma/client"
import { createRecoveryDTO } from "./dto/recovery.dto"

const prisma = new PrismaClient

export const selectRecovery = async(email: string) => {
    const otc = await prisma.recovery.findFirst({
        where: {
            userEmail: email
        }
    })

    return otc
}

export const saveRecovery = async(payload: createRecoveryDTO) => {
    const otc = await prisma.recovery.create({
        data: {
            expiresAt: new Date(new Date().getTime() + 5 * 60000),
            userEmail: payload.userEmail,
            otc: payload.otc as string,
        }
    })

    return otc
}

export const updateRecovery = async(id: number, hash: string) => {
    const otc = await prisma.recovery.update({
        where: {
            id
        },
        data: {
            expiresAt: new Date(new Date().getTime() + 5 * 60000),
            otc: hash,
            updatedAt: new Date()
        }
    })

    return otc
}