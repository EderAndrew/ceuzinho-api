import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByIdService } from "../modules/users/service";
import { selectRecoveryByOTCService } from "../modules/recovery/service";

export const createJWT = (userId: string) => {
  if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET não é definido.")
  }
  return jwt.sign(
    {sub: userId}, 
    process.env.JWT_SECRET!, 
    {
      expiresIn: "15m",
    });
};

export const createRefreshJWT = (userId: string) => {
  if(!process.env.JWT_REFRESH_SECRET){
    throw new Error("JWT_SECRET não é definido.")
  }
  return jwt.sign(
    {sub: userId},
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  )
}

export const createOTC = (payload: object) => {
  if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET não é definido.")
  }
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "5min" 
  })
}

export const decodeJwt = (token: string) => {
  const resp = jwt.decode(token);
  return JSON.parse(JSON.stringify(resp));
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const token = req.cookies?.access_token;

  if (!token) return res.status(401).json({ message: "Acesso negado" });

  try {
    const payload = jwt.verify(
      token, 
      process.env.JWT_SECRET!
    ) as { sub: string };
    const user = await findUserByIdService(Number(payload.sub));
    
    if (!user || !user.status) {
      return res.status(401).json({ message: "Acesso negado" });
    }

    req.userId = payload.sub
    
    next();
  }catch(error){
    return res.status(401).json({ message: "Acesso negado" })
  }
};

export const verifyOTC = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).json({ message: "Não autorizado a trocar a senha." });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET as string, async (error, payload: any) => {
    if (error) return res.status(401).json({ message: "Não autorizado a trocar a senha." });

    const user = await selectRecoveryByOTCService(payload.id);

    if (!user) return res.status(401).json({ message: "Não autorizado a trocar a senha." });

    next();
  });
}