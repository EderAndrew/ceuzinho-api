import { RequestHandler } from "express";
import { createUserSchema, loginUserSchema, updateUserSchema } from "./validator";
import { compare, hashSync } from "bcrypt";
import { changePasswordService, createUserService, disableUserService, findUserByEmailService, findUserByIdService, findUsersService, updateImageService, updateUserService } from "./service";
import { createJWT, decodeJwt } from "../../middlewares/jwt";
import { Role, Sex } from "@prisma/client";
import { sendEmail } from "../../lib/sendEmail";
import { ExtendFileRequest } from "../../lib/types/extendRequest";
import formidable from "formidable";
import path from "path";
import { verifyDir } from "../../lib/verifyDir";
import sharp from "sharp";
import fs from "fs/promises";
import { UpdateImageDTO } from "./dto/updateImage.dto";

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
      
      const msg = `Essa é sua senha para primeiro acesso: ${randonPwd}`
      const email = await sendEmail(safeData.data.email, msg)

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
    const safeData = updateUserSchema.safeParse(req.body)

    if(!safeData.success) return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    
    const hasUser = await findUserByIdService(parseInt(id))

    if(!hasUser) return res.status(404).json({message: "Não foi identificado um usuário com essas informações."})
    
    const user = await updateUserService(parseInt(id), safeData.data)

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
    let { id } = req.params

    const hasUser = await findUserByIdService(parseInt(id))

    if(!hasUser) return res.status(200).json({message: "Usuário não identificado."})

    await disableUserService(hasUser.id, hasUser.status)

    return res.status(200).json({ message: hasUser.status ? "Usuário desativado." : "Usuário ativado" })

  }catch(error){
    if(error instanceof Error){
      console.error(error.message)
    }
  }
}

export const changePassword: RequestHandler = async(req, res): Promise<any> => {
  try{
    const safeData = loginUserSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    }

    const verifyUser = await findUserByEmailService(safeData.data.email)

    if(!verifyUser) return res.status(404).json({ message: "Usuário não identificado." })
    
    if(!verifyUser?.status) return res.status(404).json({ message: "Usuário não identificado." })
    
    const hash = await compare(safeData.data.password, verifyUser.password);

    if(hash) return res.status(200).json({ message: "Senha não pode ser igual a senha antiga." })

    const newHash = hashSync(safeData.data.password, 10)

    const payload = {
      email: verifyUser.email,
      password: newHash
    }

    const change = await changePasswordService(payload)

    if(!change) return res.status(500).json({ massage: "Não foi possível trocar a senha do usuário." })
    
    return res.status(200).json({ message: "Senha alterada com sucesso." })
    
  }catch(error){
    console.error(error)
  }
}

export const uploadAvatar: RequestHandler = async(req: ExtendFileRequest, res): Promise<any> => {
  try{
    let {id} = req.params

    const hasUser = await findUserByIdService(parseInt(id))

    if(!hasUser) return res.status(404).json({ message: "Usuário não existe." })

    let files = req.files as {[fieldname: string]: formidable.File[]}
    if(!files.document) return res.status(404).json({ message: "Não foi identificada nenhuma imagem para upload." })
    
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
      photo: files.document[0].originalFilename?.split(".")[0],
      photoUrl: process.env.NODE_ENV === "production"
      ? `${process.env.URL_DOC_PROD}media/${files.document[0].originalFilename?.split(".")[0]}.webp`
      : `${process.env.URL_DOC_DEV}media/${files.document[0].originalFilename?.split(".")[0]}.webp`
    } as UpdateImageDTO

    const updateImage = await updateImageService(parseInt(id), formUser)

    await fs.unlink(files.document[0].filepath)
    if(!updateImage) return res.status(500).json({ message: "Não foi possível alterar a foto." })

    return res.status(200).json({ message: "Foto alterada com sucesso." })
    
  }catch(error){
    console.error(error)
  }
}

export const pong: RequestHandler = (req, res) => {
  res.status(200).json({ pong: true})
}
