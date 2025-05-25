import { PrismaClient } from "../../../generated/prisma";
import { createKidsDTO } from "./dto/createKids.dto";

const prisma = new PrismaClient()

export const createKid = async(payload: createKidsDTO) => {
    const kid = await prisma.kid.create({
        data: {
            name: payload.name,
            age: payload.age,
            birthDate: payload.birthDate,
            photo: payload.photo as string,
            room: payload.room,
            userId: payload.userId
        }
    })

    return kid
}