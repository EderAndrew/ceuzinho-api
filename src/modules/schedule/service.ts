import { CreateScheduleDTO } from "../schedule/dto/createSchedule.dto";
import * as scheduleRepo from '../schedule/repository'
export const createScheduleService = async (data: CreateScheduleDTO) => {
    return await scheduleRepo.createSchedule(data);
}

export const findSchedulesByDateService = async (date: string) => {
    return await scheduleRepo.findSchedulesByDate(date);
}

export const findScheduleByIdService = async (id: number) => {
    return await scheduleRepo.findScheduleById(id)
}

export const findScheduleByUserIdService = async (id: string) => {
    return await scheduleRepo.findScheduleByUserId(id)
}

export const updateScheduleService = async (id: number, payload:CreateScheduleDTO) => {
    return await scheduleRepo.updateSchedule(id, payload)
}

export const changeTeatcherService = async (id: number, teatcherId: number, first: boolean) => {
    if(first) return await scheduleRepo.changeFirstTeatcher(id, teatcherId)
    
    return await scheduleRepo.changeSecondTeatcher(id, teatcherId)
}

export const deleteScheduleService = async(id: number) => {
    return await scheduleRepo.deleteSchedule(id)
}