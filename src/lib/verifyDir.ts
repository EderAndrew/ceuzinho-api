import fs from "fs/promises";

export const verifyDir = async (path: string) => {
    try{
        await fs.access(path)
        return
    }catch{
        await fs.mkdir(path, { recursive: true })
        return
    }
}