import { Period, PrismaClient } from "@prisma/client";
import { CreateScheduleDTO } from "./dto/createSchedule.dto";


const prisma = new PrismaClient

export const createSchedule = async (payload: CreateScheduleDTO) => {
    const schedule = await prisma.schedule.create({
        data: {
            date: new Date(payload.date as string),
            timeStart: payload.timeStart,
            timeEnd: payload.timeEnd,
            period: payload.period as Period,
            scheduleType: payload.scheduleType as string,
            bgColor: payload.bgColor,
            room: payload.room,
            tema: payload.tema as string,
            info: payload.info,
            createdBy: payload.createdBy as number,
            teatcherOne: payload.teatcherOne,
            teatcherTwo: payload.teatcherTwo,
            document: payload.document ? payload.document : null,
            documentUrl: payload.documentUrl ? payload.documentUrl : null
        }
    })

    return schedule
}

export const findSchedulesByDate = async (date: string) => {
    const schedules = await prisma.schedule.findMany({
        where: {
            date: {
                gte: new Date(`${date}T00:00:00.000Z`),
                lte: new Date(`${date}T23:59:59.000Z`)
            }
        },
        include: {
            createdByUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            teatcherOneUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            teatcherTwoUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            }
        }
    })
    
    return schedules
}

export const findScheduleById = async (id: number) => {
    const schedule = await prisma.schedule.findUnique({
        where: {
            id: id
        },
        include: {
            createdByUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            teatcherOneUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            teatcherTwoUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            }
        }
    })

    return schedule
}

export const findScheduleByUserId = async (id: string) => {
    const schedule = await prisma.schedule.findFirst({
        where: {
            OR: [
                { teatcherOne: parseInt(id) },
                { teatcherTwo: parseInt(id) }
            ]
        },
        include: {
            createdByUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            teatcherOneUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            teatcherTwoUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            }
        }
    })

    return schedule
}

export const updateSchedule = async (id: number, payload:CreateScheduleDTO) => {
    const schedule = await prisma.schedule.update({
        where: {
            id
        },
        data: {
            period: payload.period as Period,
            timeStart: payload.timeStart,
            timeEnd: payload.timeEnd,
            bgColor: payload.bgColor,
            scheduleType: payload.scheduleType,
            room: payload.room,
            tema: payload.tema,
            teatcherOne: payload.teatcherOne,
            teatcherTwo: payload.teatcherTwo,
            document: payload.document,
            documentUrl: payload.documentUrl
        }
    })

    return schedule
}

export const changeFirstTeatcher = async(id: number, teatcherId: number) => {
    const schedule = await prisma.schedule.update({
        where: {
            id
        },
        data: {
            teatcherOne: teatcherId
        }
    })

    return schedule
}

export const changeSecondTeatcher = async(id: number, teatcherId: number) => {
    const schedule = await prisma.schedule.update({
        where: {
            id
        },
        data: {
            teatcherTwo: teatcherId
        }
    })

    return schedule
}

export const deleteSchedule = async(id: number) => {
    return await prisma.schedule.delete({
        where: {
            id
        }
    })
}