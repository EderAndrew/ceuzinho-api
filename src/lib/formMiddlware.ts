import { NextFunction, Response } from "express";
import { ExtendFileRequest } from "./types/extendRequest";
import formidable from "formidable";

export const formMiddleware = async (req: ExtendFileRequest, res: Response, next: NextFunction) => {
    try{
        const form = formidable({
            uploadDir: "./tmp",
            filter: (part) => {
                const allowed: string[] = ["image/webp", "image/jpeg", "image/png", "image/jpg"]

                if(part.mimetype && !allowed.includes(part.mimetype)){
                    return false
                }

                return true
            }
        })

        const files = []
        const fields = []

        form
            .on("field", (name, value) => {
                fields.push({ name, value })
            })
            .on("file", (name, file) => {
                files.push({ name, file })
            })
            .on("end", () => {
                console.log("Entrou aqui")
                console.log("-> upload done")
            })
        
        form.parse(req, (err, fields, files) => {
            if(err){
                next(err)
                return
            }

            req.fields = fields
            req.files = files
            next()
        })
    }catch(error){
        if(error instanceof Error){
            console.log(error.message)
        }
    }
}