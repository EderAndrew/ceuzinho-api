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

import { BACKGROUND_COLORS } from './constants';

/**
 * Determina a cor de fundo baseada no sexo do usuário
 * @param sex - Sexo do usuário
 * @returns Código hexadecimal da cor
 */
export const getBackgroundColorBySex = (sex: string): string => {
  return sex === "MASCULINO" ? BACKGROUND_COLORS.MALE : BACKGROUND_COLORS.FEMALE;
};
