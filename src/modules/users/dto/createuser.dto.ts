import { Role, Sex } from "@prisma/client";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
  photo?: string;
  phone?: string;
  sex: Sex;
  bgColor: string
}
