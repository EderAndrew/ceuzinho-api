import { CreateUserDTO } from './dto/createuser.dto';
import * as userRepo from './repository';

export const createUserService = async (data: CreateUserDTO) => {
   return await userRepo.create(data);
}

export const findUserByEmailService = async (email: string) => {
  return await userRepo.findUserByEmail(email);
}

export const findUserByIdService = async (id: number) => {
  return await userRepo.findUserById(id);
}