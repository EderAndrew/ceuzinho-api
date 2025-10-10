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

export const findScheduleByMonthService = async (month: string) => {
    return await scheduleRepo.findScheduleByMonth(month)
}

export const updateScheduleService = async (id: number, payload:CreateScheduleDTO) => {
    return await scheduleRepo.updateSchedule(id, payload)
}

export const changeTeacherService = async (id: number, teacherId: number, first: boolean) => {
    if(first) return await scheduleRepo.changeFirstTeacher(id, teacherId)
    
    return await scheduleRepo.changeSecondTeacher(id, teacherId)
}

export const deleteScheduleService = async(id: number) => {
    return await scheduleRepo.deleteSchedule(id)
}