import { Role } from "../../../../generated/prisma";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: Role
  phone: string
}
