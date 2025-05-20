import { RequestHandler } from "express";
import { createUserSchema, loginUserSchema } from "./validator";
import { compare, hashSync } from "bcrypt";
import { Role } from "../../../generated/prisma";
import { createUserService, findUserByEmailService } from "./service";
import { createJWT } from "../../lib/jwt";


export const SignIn: RequestHandler = async (req, res): Promise<any> => {
  try{
    const safeData = loginUserSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    }

    if(!safeData.data.email || !safeData.data.password) return res.status(400).json({ message: "Email ou senha não informados." })

    const user = await findUserByEmailService(safeData.data.email)

    if(!user) return res.status(404).json({ message: "Email ou senha incorreto." })

    const hash = await compare(safeData.data.password, user.password);

    if(!hash) return res.status(401).json({ message: "Email ou senha incorreto." })
    
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    const token = createJWT(payload)

    return res.status(200).json({ user, token })

  }catch(error){
    if(error instanceof Error){
      console.log(error.message)
    }
  }
}

export const createUser: RequestHandler = async (req, res): Promise<any> => {
    try{
      const safeData = createUserSchema.safeParse(req.body)

      if(!safeData.success) return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
      
      const hasUser = await findUserByEmailService(safeData.data.email)

      if(hasUser) return res.status(200).json({message: "Já existe um usuário com este email."})
      
      const hash = hashSync(safeData.data.password as string, 10)

      const payload = {
        name: safeData.data.name,
        email: safeData.data.email,
        password: hash,
        role: safeData.data.role as Role
      }

      const user = await createUserService(payload)

      if(!user) return res.status(500).json({ message: "Erro ao criar usuário." })

      return res.status(201).json({  message: "Usuário criado com sucesso." })

    }catch(error){
      if(error instanceof Error){
        console.log(error.message)
      }
    }
}

export const getUser: RequestHandler = async (req, res): Promise<any> => {
  const id = req.params.id
  
  if(!id) return res.status(400).json({ message: "ID não informado." })
  
  const user = await findUserByEmailService(id)

  if(!user) return res.status(404).json({ message: "Usuário não encontrado." })

  return res.status(200).json({ user })
}

export const pong: RequestHandler = (req, res) => {
  res.status(200).json({ pong: true})
}