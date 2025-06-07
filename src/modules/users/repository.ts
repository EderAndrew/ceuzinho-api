//configuração de conexão com o prisma
import { PrismaClient } from "@prisma/client"
import { CreateUserDTO } from "./dto/createuser.dto"
import { UpdateUserDTO } from "./dto/updateuser.dto"

const prisma = new PrismaClient

export const create = async(payload: CreateUserDTO) => {
    const user = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: payload.password as string,
            phone: payload.phone,
            role: payload.role,
            sex: payload.sex,
            bgColor: payload.bgColor as string
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

export const findUsers = async() => {
    return await prisma.user.findMany({})
}

export const updateUser = async(id: number, user: UpdateUserDTO) => {
    const userData = await prisma.user.update({
        where: {
            id
        },
        data: {
           name: user.name,
           email: user.email,
           password: user.password,
           role: user.role,
           firstAccess: false,
           phone: user.phone,
           photo: user.photo,
           photoUrl: user.photoUrl,
           updatedAt: new Date()
        }
    })

    return userData
}