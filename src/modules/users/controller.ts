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
import z, { email } from "zod";
import { UpdateUserDTO } from "./dto/updateuser.dto";

sharp.cache(false)

export const signIn: RequestHandler = async (req, res): Promise<any> => {
  try{
    const safeData = loginUserSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: z.treeifyError(safeData.error) });
    }

    const { email, password } = safeData.data
    const user = await findUserByEmailService(email)

    //Verificar se o usuário encontrado esta ativo
    if(!user || !user?.status) return res.status(403).json({ message: "Credenciais incorretas.", token: null })

    const isPasswordValid = await compare(password, user.password);

    if(!isPasswordValid) return res.status(401).json({ message: "Credenciais incorretas.", token: null })
  
    const token = createJWT({id: user.id})

    return res.status(200).json({ message: "Acesso permitido.", token })

  }catch(error){
    if(error instanceof z.ZodError){
      return res.status(500).json({ message: z.treeifyError(error) });
    }
  }
}

export const signUp: RequestHandler = async (req, res): Promise<any> => {
    try{
      const safeData = createUserSchema.safeParse(req.body)

      if(!safeData.success) return res.status(400).json({ error: z.treeifyError(safeData.error) })
      
      const hasUser = await findUserByEmailService(safeData.data.email)

      if(hasUser) return res.status(409).json({message: "Já existe um usuário com este email."})
  
      const randomPwd = generateReadablePassword(6)
      const hash = hashSync(randomPwd, 10)

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
      
      const msg = `Essa é sua senha para primeiro acesso: ${randomPwd}`
      const email = await sendEmail(safeData.data.email, msg)

      if(!email.response) return res.status(201).json({ message: "Usuário criado. Email não enviado." })

      return res.status(201).json({  message: "Usuário criado com sucesso." })

    }catch(error){
      console.error(error)
      return res.status(500).json({ message: "Erro interno do servidor." });
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
    console.error(error)
    return res.status(500).json({ message: "Erro interno do servidor." });
  }

}

export const editUser: RequestHandler = async (req: ExtendFileRequest, res): Promise<any> => {
  try{
    const userId = Number(req.params.id)
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuário inválido.' });
    }

    const existingUser  = await findUserByIdService(userId)

    if(!existingUser ) return res.status(404).json({message: 'Usuário não encontrado.'})
    
    const safeData = updateUserSchema.safeParse(req.body)
    if (!safeData.success) {
      return res.status(400).json({ error: z.treeifyError(safeData.error) });
    }

    const payload = {
      name: safeData.data.name ?? existingUser.name,
      email: safeData.data.email ?? existingUser.email,
      phone: safeData.data.phone ?? existingUser.phone,
      role: safeData.data.role as Role ?? existingUser.role,
    } as UpdateUserDTO

    const user = await updateUserService(userId, payload)

    if(!user) return res.status(500).json({ message: "Erro ao editar usuário." })

    return res.status(200).json({ message: "Usuário editado com sucesso." })
  }catch(error){
    if(error instanceof z.ZodError){
      return res.status(500).json({ message: z.treeifyError(error).errors[0] });
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
    console.error(error)
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export const changePassword: RequestHandler = async(req, res): Promise<any> => {
  try{
    const safeData = loginUserSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: z.treeifyError(safeData.error) });
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
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export const uploadAvatar: RequestHandler = async(req: ExtendFileRequest, res): Promise<any> => {
  try{
    const userId = Number(req.params.id)
    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const hasUser = await findUserByIdService(userId)

    if(!hasUser) return res.status(404).json({ message: "Usuário não existe." })

    let files = req.files as {[fieldname: string]: formidable.File[]}
    const file = files?.document?.[0];

    if(!file) return res.status(400).json({ message: "Nenhuma imagem enviada." })
    
    const imageTypes = ["image/webp", "image/jpeg", "image/png", "image/jpg"]

    if(!imageTypes.includes(file.mimetype as string)){
      return res.status(415).json({ message: "Tipo de imagem incompativel. Escolha uma imagem do tipo jpg ou png." })
    }

    const publicDir = path.join(__dirname, "../../../public/media");
    const originalName = file.originalFilename?.split(".")[0]
    
    await verifyDir(publicDir)

    await sharp(file.filepath)
     .toFormat("webp")
     .toFile(`./public/media/${originalName}.webp`)

    const formUser = {
      photo: originalName,
      photoUrl: process.env.NODE_ENV === "production"
      ? `${process.env.URL_DOC_PROD}media/${originalName}.webp`
      : `${process.env.URL_DOC_DEV}media/${originalName}.webp`
    } as UpdateImageDTO

    const updateImage = await updateImageService(userId, formUser)

    await fs.unlink(file.filepath)
    if(!updateImage) return res.status(500).json({ message: "Não foi possível alterar a foto." })

    return res.status(200).json({ message: "Foto alterada com sucesso." })
    
  }catch(error){
    console.error("Erro no upload de avatar: ",error)
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

const generateReadablePassword = (length: number = 8) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'; // sem caracteres ambíguos
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export const pong: RequestHandler = (req, res) => {
  res.status(200).json({ pong: true})
}
