export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
  photo?: string;
  phone?: string
}
