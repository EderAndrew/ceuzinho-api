import { RequestHandler } from "express";
import { createKidSchema } from "./validator";
import { createKidService } from "./service";
import { ExtendFileRequest } from "../../lib/types/extendRequest";

export const createKid: RequestHandler = async (req: ExtendFileRequest, res): Promise<any> => {
    try {
        console.log(req)
        /* const FKid = {
            name: req.fields?.name,
            age: safeData.data.age,
            birthDate: safeData.data.birthDate,
            photo: req.files[0].file.newFilename,
            room: safeData.data.room,
            userId: id
        } */
        const { id } = req.params;
        const safeData = createKidSchema.safeParse(req.body);

        if (!safeData.success) {
            return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        }

        const payload = {
            
        }
        //const data = await createKidService(payload)
    } catch (error) {
        if (error instanceof Error) {
        console.log(error.message);
        }
    }

}