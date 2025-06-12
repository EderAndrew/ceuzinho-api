import { createRecoveryDTO } from './dto/recovery.dto';
import * as recoveryRepo from './repository';

export const selectRecoveryService = async(email: string) => {
    return await recoveryRepo.selectRecovery(email)
}

export const saveRecoveryService = async(payload: createRecoveryDTO) => {
    return await recoveryRepo.saveRecovery(payload)
}

export const updateRecoveryService = async(id: number, hash: string) => {
    return await recoveryRepo.updateRecovery(id, hash)
}

export const selectRecoveryByOTCService = async(id: number) => {
    return await recoveryRepo.selectOTC(id)
}