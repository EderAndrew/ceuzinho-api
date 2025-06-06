import { RequestHandler } from "express";
import { createUserSchema, loginUserSchema } from "./validator";
import { compare, hashSync } from "bcrypt";
import { createUserService, findUserByEmailService, findUserByIdService, findUsersService } from "./service";
import { createJWT, decodeJwt } from "../../middlewares/jwt";
import { Role, Sex } from "@prisma/client";


export const signIn: RequestHandler = async (req, res): Promise<any> => {
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
  
    const token = createJWT({id: user.id})

    return res.status(200).json({ token })

  }catch(error){
    if(error instanceof Error){
      console.log(error.message)
    }
  }
}

export const signUp: RequestHandler = async (req, res): Promise<any> => {
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
        phone: safeData.data.phone,
        role: safeData.data.role as Role,
        sex: safeData.data.sex as Sex,
        bgColor: safeData.data.sex === "MASCULINO" ? "#009CD9" : "#DF1B7D"
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

export const me: RequestHandler = async (req, res): Promise<any> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  const resp = decodeJwt(token as string)

  if(!resp?.id) return res.status(400).json({ message: "ID não informado." })
  
  const user = await findUserByIdService(resp.id)

  if(!user) return res.status(404).json({ message: "Usuário não encontrado." })

  return res.status(200).json({ user })
}

export const allUsers: RequestHandler = async (req, res): Promise<any> => {
  try{
    const users = await findUsersService()

    if(!users) return res.status(404).json({ message: "Usuários nao encontrados." })

    return res.status(200).json({ users })
  }catch(error){
    if(error instanceof Error){
      console.log(error.message)
    }
  }

}

export const sendEmail: RequestHandler = (req, res) => {
  
}

export const pong: RequestHandler = (req, res) => {
  res.status(200).json({ pong: true})
}
