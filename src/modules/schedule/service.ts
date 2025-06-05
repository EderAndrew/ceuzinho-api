import { CreateScheduleDTO } from "../schedule/dto/createSchedule.dto";
import * as scheduleRepo from '../schedule/repository'
export const createScheduleService = async (data: CreateScheduleDTO) => {
    return await scheduleRepo.createSchedule(data);
}