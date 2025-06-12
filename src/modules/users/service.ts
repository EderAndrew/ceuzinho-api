import { CreateUserDTO } from './dto/createuser.dto';
import { LoginUserDTO } from './dto/loginUser.dto';
import { UpdateImageDTO } from './dto/updateImage.dto';
import { UpdateUserDTO } from './dto/updateuser.dto';
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

export const findUsersService = async () => {
  return await userRepo.findUsers();
}

export const updateUserService = async (id: number, user: UpdateUserDTO) => {
  return await userRepo.updateUser(id, user)
}

export const disableUserService = async (id: number, userStatus: boolean) => {
  return await userRepo.handleDisabled(id, userStatus)
}

export const changePasswordService = async(payload: LoginUserDTO) => {
  return await userRepo.changePassword(payload)
}

export const updateImageService = async(id: number, payload: UpdateImageDTO) => {
  return await userRepo.updatePhoto(id, payload)
}