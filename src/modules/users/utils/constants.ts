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

export const RECOVERY_MESSAGES = {
  OTC_SENT_SUCCESS: "OTC enviado com sucesso.",
  OTC_SENT_FAILED: "Email não enviado.",
  OTC_NOT_REGISTERED: "OTC não registrado",
  OTC_CODE_NOT_REGISTERED: "Código OTC não registrado",
  OTC_CODE_SENT_SUCCESS: "Código OTC enviado com sucesso.",
  USER_NOT_FOUND: "Usuário não identificado.",
  EMAIL_NOT_PROVIDED: "Email não informado.",
  OTC_VERIFIED_SUCCESS: "Troca permitida.",
  OTC_INVALID: "Código OTC não confere.",
  OTC_EXPIRED: "Código de recuperação expirou. Tente novamente",
  USER_NOT_FOUND_VERIFY: "Não foi encontrado esse usuário.",
  PASSWORD_NOT_MATCH: "Senhas não correspondem.",
  PASSWORD_TOO_SHORT: "Senha deve ter no mínimo 6 caracteres.",
  PASSWORD_CHANGE_FAILED: "Erro ao mudar senha.",
  PASSWORD_CHANGED_SUCCESS: "Senha alterada com sucesso."
} as const;

export const OTC_CONFIG = {
  MIN_VALUE: 100000,
  MAX_VALUE: 999999,
  EXPIRATION_MINUTES: 5,
  SALT_ROUNDS: 10
} as const;
