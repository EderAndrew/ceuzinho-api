/**
 * Tipos para respostas padronizadas da API
 */

export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    error?: any;
  }
  
  export interface UserCreatedResponse {
    message: string;
    userId: number;
  }
  
  export interface ErrorResponse {
    message: string;
    error?: any;
  }
  
  export interface ValidationErrorResponse {
    error: any;
  }