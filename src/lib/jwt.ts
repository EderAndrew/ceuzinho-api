import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByIdService } from "../modules/users/service";

export const createJWT = (payload: object) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET as string, {
    expiresIn: "2h",
  });
};

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