import { CreateImpedimentDTO } from "./dto/createImpediment.dto";
import * as impedimentRepo from "./repository"

export const createImpedimentService = async (payload: CreateImpedimentDTO) => {
    return await impedimentRepo.createImpediment(payload)
}

export const selectImpedimentService = async (id: number) => {
    return await impedimentRepo.selectImpediment(id)
}

export const updateImpedimentService = async (id: number, userId: number) => {
    return await impedimentRepo.updateImpediment(id, userId)
}

export const cancelImpedimentService = async (id: number) => {
    return await impedimentRepo.cancelImpediment(id)
}

export const findAllImpedimentsService = async () => {
    return await impedimentRepo.findAllImpediments()
}