import { Period } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateScheduleDTO } from "./dto/createSchedule.dto";
import { startOfDay, endOfDay } from 'date-fns';


export const createSchedule = async (payload: CreateScheduleDTO) => {
    const schedule = await prisma.schedule.create({
        data: {
            date: new Date(payload.date as string),
            month: payload.month,
            timeStart: payload.timeStart,
            timeEnd: payload.timeEnd,
            period: payload.period as Period,
            scheduleType: payload.scheduleType as string,
            bgColor: payload.bgColor,
            room: payload.room,
            tema: payload.tema as string,
            info: payload.info,
            createdBy: payload.createdBy as number,
            teacherOne: payload.teacherOne,
            teacherTwo: payload.teacherTwo,
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
                gte: startOfDay(new Date(date)),
                lte: endOfDay(new Date(date))
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
            teacherOneUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            teacherTwoUser: {
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
            teacherOneUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            teacherTwoUser: {
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
    const schedule = await prisma.schedule.findMany({
        where: {
            OR: [
                { teacherOne: parseInt(id) },
                { teacherTwo: parseInt(id) }
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
            teacherOneUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            teacherTwoUser: {
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

export const findScheduleByMonth = async (month: string) => {
     const schedule = await prisma.schedule.findMany({
        where: {
            month
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
            teacherOneUser: {
                select: {
                    id: true,
                    photo: true,
                    photoUrl: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            teacherTwoUser: {
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
            teacherOne: payload.teacherOne,
            teacherTwo: payload.teacherTwo,
            document: payload.document,
            documentUrl: payload.documentUrl,
            updatedAt: new Date()
        }
    })

    return schedule
}

export const changeFirstTeacher = async(id: number, teacherId: number) => {
    const schedule = await prisma.schedule.update({
        where: {
            id
        },
        data: {
            teacherOne: teacherId
        }
    })

    return schedule
}

export const changeSecondTeacher = async(id: number, teacherId: number) => {
    const schedule = await prisma.schedule.update({
        where: {
            id
        },
        data: {
            teacherTwo: teacherId
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