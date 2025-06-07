import { Role } from "@prisma/client";

export interface UpdateUserDTO {
  name: string;
  email: string;
  password?: string;
  role?: Role;
  photo?: string;
  photoUrl?: string;
  phone?: string;
}