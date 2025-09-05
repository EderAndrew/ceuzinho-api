import { RequestHandler } from "express";
import { createUserSchema, loginUserSchema, updateUserSchema } from "./validator";
import { compare, hashSync } from "bcrypt";
import { 
  changePasswordService, 
  createUserService, 
  disableUserService, 
  findUserByEmailService, 
  findUserByIdService, 
  findUsersService, 
  updateImageService, 
  updateUserService 
} from "./service";
import { createJWT, decodeJwt } from "../../middlewares/jwt";
import { Role, Sex } from "@prisma/client";
import {  generateReadablePassword, getBackgroundColorBySex } from "./utils/userUtils";
import { sendEmail } from "../recovery/utils/recoveryUtils";
import { ExtendFileRequest } from "../../lib/types/extendRequest";
import formidable from "formidable";
import path from "path";
import { verifyDir } from "../schedule/utils/scheduleUtils";
import sharp from "sharp";
import fs from "fs/promises";
import { UpdateImageDTO } from "./dto/updateImage.dto";
import z from "zod";
import { UpdateUserDTO } from "./dto/updateuser.dto";
import { USER_MESSAGES, PASSWORD_CONFIG } from "./utils/constants";

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
  try {
    // 1. Validação dos dados de entrada
    const safeData = createUserSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ 
        error: z.treeifyError(safeData.error) 
      });
    }

    // 2. Verificação de usuário existente
    const existingUser = await findUserByEmailService(safeData.data.email);
    if (existingUser) {
      return res.status(409).json({
        message: USER_MESSAGES.ALREADY_EXISTS
      });
    }

    // 3. Geração de senha e hash
    const randomPassword = generateReadablePassword(PASSWORD_CONFIG.DEFAULT_LENGTH);
    const hashedPassword = hashSync(randomPassword, PASSWORD_CONFIG.SALT_ROUNDS);

    // 4. Preparação do payload
    const userPayload = {
      name: safeData.data.name,
      email: safeData.data.email,
      password: hashedPassword,
      phone: safeData.data.phone,
      role: safeData.data.role as Role,
      sex: safeData.data.sex as Sex,
      bgColor: getBackgroundColorBySex(safeData.data.sex as string)
    };

    // 5. Criação do usuário
    const createdUser = await createUserService(userPayload);
    if (!createdUser) {
      return res.status(500).json({ 
        message: USER_MESSAGES.CREATION_ERROR
      });
    }

    // 6. Envio de email com senha
    const emailMessage = `Essa é sua senha para primeiro acesso: ${randomPassword}`;
    const emailResult = await sendEmail(safeData.data.email, emailMessage);

    // 7. Resposta baseada no resultado do email
    if (!emailResult.response) {
      return res.status(201).json({ 
        message: USER_MESSAGES.CREATED_EMAIL_FAILED,
        userId: createdUser.id
      });
    }

    return res.status(201).json({ 
      message: USER_MESSAGES.CREATED_SUCCESS,
      userId: createdUser.id
    });

  } catch (error) {
    console.error('Erro no signUp:', error);
    
    // Tratamento específico para erros de validação Zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: z.treeifyError(error) 
      });
    }

    // Tratamento para outros tipos de erro
    return res.status(500).json({ 
      message: USER_MESSAGES.INTERNAL_ERROR,
      ...(process.env.NODE_ENV === 'development' && { 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      })
    });
  }
};

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

    if(!hasUser) return res.status(404).json({message: "Usuário não identificado."})

    await disableUserService(hasUser.id, hasUser.status)

    return res.status(200).json({ message: hasUser.status ? "Usuário desativado." : "Usuário ativado" })

  }catch(error){
    if(error instanceof z.ZodError){
      return res.status(500).json({ message: z.treeifyError(error).errors[0] });
    }
  }
}

export const changePassword: RequestHandler = async(req, res): Promise<any> => {
  try{
    const safeData = loginUserSchema.safeParse(req.body);
    if (!safeData.success) {
      return res.status(400).json({ error: z.treeifyError(safeData.error) });
    }

    const verifyUser = await findUserByEmailService(safeData.data.email)
    
    if(!verifyUser || !verifyUser?.status) return res.status(404).json({ message: "Usuário não identificado." })
    
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
    if(error instanceof z.ZodError){
      return res.status(500).json({ message: z.treeifyError(error).errors[0] });
    }
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

    const files = req.files as {[fieldname: string]: formidable.File[]}
    const candidateKeys = ["document", "file", "avatar", "image"]
    let uploaded: formidable.File | undefined
    if(files){
      for(const key of candidateKeys){
        const arr = (files as any)[key] as formidable.File[] | undefined
        if(Array.isArray(arr) && arr[0]){
          uploaded = arr[0]
          break
        }
      }
      if(!uploaded){
        const firstKey = Object.keys(files)[0]
        if(firstKey){
          const arr = (files as any)[firstKey] as formidable.File[]
          uploaded = Array.isArray(arr) ? arr[0] : undefined
        }
      }
    }

    if(!uploaded) return res.status(400).json({ message: "Nenhuma imagem enviada." })
    
    const imageTypes = ["image/webp", "image/jpeg", "image/png", "image/jpg", "image/heic", "image/heif"]

    if(!imageTypes.includes(uploaded.mimetype as string)){
      return res.status(415).json({ message: "Tipo de imagem incompativel. Escolha uma imagem do tipo jpg ou png." })
    }

    const publicDir = path.join(__dirname, "../../../public/media");
    const originalName = uploaded.originalFilename?.split(".")[0]
    
    await verifyDir(publicDir)

    const sharpInput = uploaded.filepath
    // Reduzir/comprimir imagens grandes
    const transformer = sharp(sharpInput)
      .rotate()
      .resize({ width: 1024, withoutEnlargement: true })
      .webp({ quality: 80 })

    await transformer.toFile(`./public/media/${originalName}.webp`)

    const formUser = {
      photo: originalName,
      photoUrl: process.env.NODE_ENV === "production"
      ? `${process.env.URL_DOC_PROD}/media/${originalName}.webp`
      : `${process.env.URL_DOC_DEV}/media/${originalName}.webp`
    } as UpdateImageDTO

    const updateImage = await updateImageService(userId, formUser)

    await fs.unlink(uploaded.filepath)
    if(!updateImage) return res.status(500).json({ message: "Não foi possível alterar a foto." })

    return res.status(200).json({ message: "Foto alterada com sucesso." })
    
  }catch(error){
    if(error instanceof z.ZodError){
      return res.status(500).json({ message: z.treeifyError(error).errors[0] });
    }
  }
}



export const pong: RequestHandler = (req, res) => {
  res.status(200).json({ pong: true})
}
