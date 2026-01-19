import { Role } from "../../../generated/prisma/enums";

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: Role;
  photo?: string;
  photoUrl?: string;
  phone?: string;
  status?: boolean
}