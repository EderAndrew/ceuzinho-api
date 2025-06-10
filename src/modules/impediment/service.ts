import { CreateImpedimentDTO } from "./dto/createImpediment.dto";
import * as impedimentRepo from "./repository"

export const createImpedimentService = async (payload: CreateImpedimentDTO) => {
    return await impedimentRepo.createImpediment(payload)
}