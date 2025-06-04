export interface CreateScheduleDTO {
    id?: number,
    date: Date,
    timeStart?: string,
    timeEnd?: string,
    period?: string,
    scheduleType: string,
    tema: string,
    info?: string,
    createdBy: number,
    teatcherOne?: number,
    teatcherTwo?: number,
    ministratorOne?: string,
    ministratorTwo?: string,
    document?: string,
    createdAt: Date,
    updatedAt?: Date
}