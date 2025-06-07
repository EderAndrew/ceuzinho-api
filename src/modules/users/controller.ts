import { RequestHandler } from "express";
import { createUserSchema, loginUserSchema, updateUserSchema } from "./validator";
import { compare, hashSync } from "bcrypt";
import { createUserService, disableUserService, findUserByEmailService, findUserByIdService, findUsersService, updateUserService } from "./service";
import { createJWT, decodeJwt } from "../../middlewares/jwt";
import { Role, Sex } from "@prisma/client";
import { sendEmail } from "../../lib/sendEmail";
import { ExtendFileRequest } from "../../lib/types/extendRequest";
import { UpdateUserDTO } from "./dto/updateuser.dto";
import formidable from "formidable";
import path from "path";
import { verifyDir } from "../../lib/verifyDir";
import sharp from "sharp";
import fs from "fs/promises";

sharp.cache(false)

export const signIn: RequestHandler = async (req, res): Promise<any> => {
  try{
    const safeData = loginUserSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    }

    if(!safeData.data.email || !safeData.data.password) return res.status(400).json({ message: "Email ou senha não informados.", token: null })

    const user = await findUserByEmailService(safeData.data.email)
    
    //Verificar se o usuário encontrado esta ativo
    if(!user?.status) return res.status(200).json({ message: "Usuário não identificado.", token: null })

    if(!user) return res.status(404).json({ message: "Email ou senha incorreto.", token: null })

    const hash = await compare(safeData.data.password, user.password);

    if(!hash) return res.status(401).json({ message: "Email ou senha incorreto.", token: null })
  
    const token = createJWT({id: user.id})

    return res.status(200).json({ message: "Acesso permitido.", token })

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
      
      let randonPwd = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
      
      const hash = hashSync(randonPwd.toString(), 10)

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
      
      const email = await sendEmail(safeData.data.email, randonPwd.toString())

      if(!email.response) return res.status(201).json({ message: "Usuário criado. Email não enviado." })

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

export const editUser: RequestHandler = async (req: ExtendFileRequest, res): Promise<any> => {
  try{
    const { id } = req.params
    const EUser = {
      name: req.fields?.name?.[0],
      email: req.fields?.email?.[0],
      password: req.fields?.password?.[0],
      role: req.fields?.role?.[0],
      phone: req.fields?.phone?.[0]
    } as UpdateUserDTO

    const safeData = updateUserSchema.safeParse(EUser)

    if(!safeData.success) return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    
    const hasUser = await findUserByIdService(parseInt(id))

    if(!hasUser) return res.status(404).json({message: "Não foi identificado um usuário com essas informações."})
    
    let files = req.files as {[fieldname: string]: formidable.File[]}

    if(!files.document) {
      let pwdUser:UpdateUserDTO = {...EUser}

      if(req.fields?.password?.[0] !== undefined){
        const hash = hashSync(req.fields?.password?.[0] as string, 10)

        pwdUser = {
          ...EUser,
          password: hash
        }
      }
      
      const user = await updateUserService(parseInt(id), pwdUser)

      if(!user) return res.status(500).json({ message: "Erro ao editar usuário." })

      return res.status(200).json({ message: "Usuário editado com sucesso..." })
    }

    const imageTypes = ["image/webp", "image/jpeg", "image/png", "image/jpg"]

    if(!imageTypes.includes(files.document[0].mimetype as string)){
      return res.status(500).json({ message: "Tipo de imagem incompativel. Escolha uma imagem do tipo jpg ou png." })
    }

    const publicDir = path.join(__dirname, "../../../public/media");
    
    await verifyDir(publicDir)

    await sharp(files.document[0].filepath)
     .toFormat("webp")
     .toFile(`./public/media/${files.document[0].originalFilename?.split(".")[0]}.webp`)

    const formUser = {
      ...EUser,
      photo: files.document[0].originalFilename?.split(".")[0],
      photoUrl: process.env.NODE_ENV === "production"
      ? `${process.env.URL_DOC_PROD}media/${files.document[0].originalFilename?.split(".")[0]}.webp`
      : `${process.env.URL_DOC_DEV}media/${files.document[0].originalFilename?.split(".")[0]}.webp`
    }

    await fs.unlink(files.document[0].filepath)

    const user = await updateUserService(parseInt(id), formUser)

    if(!user) return res.status(500).json({ message: "Erro ao atualizar usuário." })
        
    return res.status(200).json({ message: "Usuário atualizado com sucesso" })

  }catch(error){
    if(error instanceof Error){
      console.error(error.message)
    }
  }
}

export const disableUser: RequestHandler = async(req, res): Promise<any> => {
  try{
    let { id, status } = req.body

    const hasUser = await findUserByIdService(id)

    if(!hasUser) return res.status(200).json({message: "Usuário não identificado."})

    await disableUserService(id, status)

    return res.status(200).json({ message: "Usuário desativado." })

  }catch(error){
    if(error instanceof Error){
      console.error(error.message)
    }
  }
}

export const pong: RequestHandler = (req, res) => {
  res.status(200).json({ pong: true})
}
