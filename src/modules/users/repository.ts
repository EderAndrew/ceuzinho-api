//configuração de conexão com o prisma
import { PrismaClient } from "@prisma/client"
import { CreateUserDTO } from "./dto/createuser.dto"

const prisma = new PrismaClient

export const create = async(payload: CreateUserDTO) => {
    const user = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: payload.password,
            role: payload.role,
            sex: payload.sex,
            bgColor: payload.bgColor
        }
    })

    return user
}

export const findUserByEmail = async(email: string) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    })
}

export const findUserById = async(id: number) => {
    return await prisma.user.findUnique({
        where: {
            id
        }
    })
}