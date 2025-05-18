//configuração de conexão com o prisma
import { PrismaClient } from "../../../generated/prisma"
import { CreateUserDTO } from "./dto/createuser.dto"
import { auth } from "../../lib/auth"


const prisma = new PrismaClient

export const newUser = async(payload: CreateUserDTO) => {
    const data = await auth.api.signUpEmail({
        body: {
            name: payload.name,
            email: payload.email,
            password: payload.password
        }
    })

    return data
}

export const findUserByEmail = async(email: string) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    })
}