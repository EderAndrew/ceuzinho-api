import { NextFunction, Response } from "express";
import { ExtendFileRequest } from "../lib/types/extendRequest";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

export const formMiddleware = async (req: ExtendFileRequest, res: Response, next: NextFunction) => {
    try{
        const uploadDir = path.resolve("./tmp")
        await fs.access(uploadDir).catch(async () => {
            await fs.mkdir(uploadDir, { recursive: true })
        })

        const form = formidable({
            uploadDir,
            maxFileSize: 100 * 1024 * 1024, // 100MB por arquivo
            maxTotalFileSize: 200 * 1024 * 1024, // 200MB por requisição
            allowEmptyFiles: false,
            multiples: false,
            filter: (part) => {
                const allowed: string[] = [
                    "image/webp",
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                    "image/heic",
                    "image/heif",
                    "application/pdf"
                ]

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
                const anyErr = err as any
                if(anyErr?.code === 'ETOOBIG'){
                    res.status(413).json({ message: "Arquivo muito grande. Tamanho máximo permitido excedido." })
                    return
                }
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