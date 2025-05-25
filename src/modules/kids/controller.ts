import { RequestHandler } from "express";
import { createKidSchema } from "./validator";
import { createKidService } from "./service";

export const createKid: RequestHandler = async (req, res): Promise<any> => {
    try {
        const { id } = req.params;
        const safeData = createKidSchema.safeParse(req.body);

        if (!safeData.success) {
            return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        }
        const payload = {
            name: safeData.data.name,
            age: safeData.data.age,
            birthDate: safeData.data.birthDate,
            photo: req.files[0].file.newFilename,
            room: safeData.data.room,
            userId: id
        }
        const data = await createKidService(payload)
    } catch (error) {
        if (error instanceof Error) {
        console.log(error.message);
        }
    }

}