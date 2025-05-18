import { RequestHandler } from "express";
import { createUserSchema } from "./validator";
import { hashSync } from "bcrypt";
import { findUserByEmail, newUser } from "./repository";

export const createUser: RequestHandler = async (req, res): Promise<any> => {
    try{
      const safeData = createUserSchema.safeParse(req.body)

      if(!safeData.success) return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
      
      const hasUser = await findUserByEmail(safeData.data.email)

      if(hasUser) return res.status(200).json({message: "Já existe um usuário com este email."})
      
      const hash = hashSync(safeData.data.password as string, 10)

      const payload = {
          name: safeData.data.name,
          email: safeData.data.email,
          password: hash
      }

      const user = await newUser(payload)

      if(!user) return res.status(500).json({ message: "Erro ao criar usuário." })

      return res.status(201).json({ user })

    }catch(error){
      if(error instanceof Error){
        console.log(error.message)
      }
    }
}

export const pong: RequestHandler = (req, res) => {
  res.status(200).json({ pong: true})
}