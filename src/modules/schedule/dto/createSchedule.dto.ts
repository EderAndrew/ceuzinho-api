import { Room } from "@prisma/client"

export interface CreateScheduleDTO {
    id?: number,
    date: string,
    timeStart?: string,
    timeEnd?: string,
    bgColor: string,
    period?: string,
    scheduleType: string,
    room?: Room,
    tema: string,
    info?: string,
    createdBy: number,
    teatcherOne?: number,
    teatcherTwo?: number,
    ministratorOne?: string,
    ministratorTwo?: string,
    document?: string,
    documentUrl?: string,
    createdAt: Date,
    updatedAt?: Date
}