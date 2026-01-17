//configuração de conexão com o prisma

import { CreateUserDTO } from "./dto/createuser.dto"
import { UpdateUserDTO } from "./dto/updateuser.dto"
import { LoginUserDTO } from "./dto/loginUser.dto"
import { UpdateImageDTO } from "./dto/updateImage.dto"
import { prisma } from "../../lib/prisma"

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

export const findAllteachers = async() => {
    return await prisma.user.findMany({
        where: {
            OR: [
                { role: "PROFESSOR" },
                { role: "PASTOR" },
                { role: "ADMIN" }
            ]
        }
    })
}

export const updateUser = async(id: number, user: UpdateUserDTO) => {
    const userData = await prisma.user.update({
        where: {
            id
        },
        data: {
           name: user.name,
           email: user.email,
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

export const handleDisabled = async(id: number, userStatus: boolean) => {
    const user = await prisma.user.update({
        where:{
            id
        },
        data:{
            status: userStatus ? false : true
        }
    })

    return user
}

export const changePassword = async(payload: LoginUserDTO) => {
    const user = await prisma.user.update({
        where: {
            email: payload.email
        },
        data: {
            password: payload.password
        }
    })

    return user
}

export const updatePhoto = async(id: number, payload: UpdateImageDTO) => {
    const photo = await prisma.user.update({
        where: {
            id
        },
        data: {
            photo: payload.photo,
            photoUrl: payload.photoUrl
        }
    })

    return photo
}