/* import { Request, Response, NextFunction } from 'express';
import * as userService from './service';

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}; */