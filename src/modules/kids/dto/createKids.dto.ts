import { Room } from "../../../generated/prisma/enums";


export interface createKidsDTO {
    id?: number;
    photo?: string;
    name: string;
    age: number;
    birthDate: Date;
    room: Room;
    userId: number;
    created_at: Date;
}