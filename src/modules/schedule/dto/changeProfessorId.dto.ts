import { Room } from "@prisma/client"

export interface ChangeProfessorIdDTO {
    id: number,
    newId: number,
    oldId: number
}