import { Role, Sex } from "../../../generated/prisma/enums";


export interface CreateUserDTO {
  name: string;
  email: string;
  password?: string;
  role?: Role;
  photo?: string;
  phone?: string;
  sex: Sex;
  bgColor?: string
}
