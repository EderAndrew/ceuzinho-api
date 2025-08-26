import {describe, expect} from '@jest/globals';
import { signIn } from "../controller"; // ajuste o caminho
import { compare } from "bcrypt";
import { createJWT } from "../../../middlewares/jwt";

jest.mock("../services/userService");
jest.mock("bcryptjs");
jest.mock("../utils/jwt");

describe("signIn", () => {
  const mockReq = (body: any) => ({ body } as any);
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 400 se os dados forem inválidos", async () => {
    const req = mockReq({ email: "", password: "" });
    const res = mockRes();

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.any(Object),
      token: null
    }));
  });

  it("deve retornar 403 se o usuário não existir ou estiver inativo", async () => {
    (findUserByEmailService as jest.Mock).mockResolvedValue(null);

    const req = mockReq({ email: "test@example.com", password: "123456" });
    const res = mockRes();

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Credenciais incorretas.", token: null });
  });

  it("deve retornar 401 se a senha estiver incorreta", async () => {
    (findUserByEmailService as jest.Mock).mockResolvedValue({ email: "test@example.com", password: "hashed", status: true });
    (compare as jest.Mock).mockResolvedValue(false);

    const req = mockReq({ email: "test@example.com", password: "wrongpass" });
    const res = mockRes();

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Credenciais incorretas.", token: null });
  });

  it("deve retornar 200 e token se login for bem-sucedido", async () => {
    (findUserByEmailService as jest.Mock).mockResolvedValue({ id: 1, email: "test@example.com", password: "hashed", status: true });
    (compare as jest.Mock).mockResolvedValue(true);
    (createJWT as jest.Mock).mockReturnValue("fake-token");

    const req = mockReq({ email: "test@example.com", password: "123456" });
    const res = mockRes();

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Acesso permitido.", token: "fake-token" });
  });
});