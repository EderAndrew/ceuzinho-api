// Constantes para configuração dos períodos
export const PERIOD_CONFIG = {
    MANHÃ: {
        timeStart: "09:00",
        timeEnd: "11:00",
        bgColor: "#EBBC16"
    },
    TARDE: {
        timeStart: "14:00",
        timeEnd: "16:00",
        bgColor: "#7A9B44"
    },
    NOITE: {
        timeStart: "19:00",
        timeEnd: "21:00",
        bgColor: "#043A68"
    }
} as const;

export type PeriodType = keyof typeof PERIOD_CONFIG;

// Função utilitária para obter configuração do período
export const getPeriodConfig = (period: string) => {
    const config = PERIOD_CONFIG[period as PeriodType];
    if (!config) {
        throw new Error(`Período inválido: ${period}`);
    }
    return config;
};

// Função utilitária para extrair campo seguro do request
export const getFieldValue = (fields: any, fieldName: string): string | undefined => {
    return fields?.[fieldName]?.[0];
};

// Função utilitária para converter string para número
export const parseNumberField = (value: string | undefined): number | undefined => {
    return value ? parseInt(value, 10) : undefined;
};

// Função utilitária para construir URL do documento
export const buildDocumentUrl = (
    filename: string, 
    isProduction: boolean, 
    baseUrl: string = '',
    isWebp: boolean = false
): string => {
    const extension = isWebp ? '.webp' : '';
    const folder = isWebp ? 'media' : 'files';
    const envVar = isProduction ? 'URL_DOC_PROD' : 'URL_DOC_DEV';
    
    return `${process.env[envVar]}${folder}/${filename}${extension}`;
};
