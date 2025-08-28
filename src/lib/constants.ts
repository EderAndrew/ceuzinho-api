/**
 * Constantes da aplicação
 */

export const USER_MESSAGES = {
  CREATED_SUCCESS: "Usuário criado com sucesso.",
  CREATED_EMAIL_FAILED: "Usuário criado com sucesso, mas email não foi enviado.",
  ALREADY_EXISTS: "Já existe um usuário com este email.",
  CREATION_ERROR: "Erro ao criar usuário.",
  INTERNAL_ERROR: "Erro interno do servidor."
} as const;

export const VALIDATION_MESSAGES = {
  INVALID_DATA: "Dados inválidos fornecidos."
} as const;

export const PASSWORD_CONFIG = {
  DEFAULT_LENGTH: 6,
  SALT_ROUNDS: 10
} as const;

export const BACKGROUND_COLORS = {
  MALE: "#009CD9",
  FEMALE: "#DF1B7D"
} as const;
