import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByIdService } from "../modules/users/service";
import { selectRecoveryByOTCService } from "../modules/recovery/service";

export const createJWT = (payload: object) => {
  if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET não é definido.")
  }
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "2h",
  });
};

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
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).json({ message: "Acesso negado" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET as string, async (error, payload: any) => {
    if (error) return res.status(401).json({ message: "Acesso negado" });

    const user = await findUserByIdService(payload.id);

    if (!user) return res.status(401).json({ message: "Acesso negado" });

    next();
  });
};

export const verifyODT = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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