/**
 * Gera uma senha aleatória legível
 * @param length - Comprimento da senha (padrão: 8)
 * @returns Senha aleatória sem caracteres ambíguos
 */
export const generateReadablePassword = (length: number = 8): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'; // sem caracteres ambíguos
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

import { BACKGROUND_COLORS, OTC_CONFIG } from './constants';

/**
 * Determina a cor de fundo baseada no sexo do usuário
 * @param sex - Sexo do usuário
 * @returns Código hexadecimal da cor
 */
export const getBackgroundColorBySex = (sex: string): string => {
  return sex === "MASCULINO" ? BACKGROUND_COLORS.MALE : BACKGROUND_COLORS.FEMALE;
};

/**
 * Gera um código OTC de 6 dígitos
 * @returns Código OTC numérico
 */
export const generateOTCCode = (): number => {
  return Math.floor(Math.random() * (OTC_CONFIG.MAX_VALUE - OTC_CONFIG.MIN_VALUE + 1)) + OTC_CONFIG.MIN_VALUE;
};

/**
 * Calcula a data de expiração para códigos OTC
 * @param minutes - Minutos para expiração (padrão: 5)
 * @returns Data de expiração
 */
export const calculateExpirationDate = (minutes: number = OTC_CONFIG.EXPIRATION_MINUTES): Date => {
  return new Date(new Date().getTime() + minutes * 60000);
};
