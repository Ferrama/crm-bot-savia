import { i18n } from '../translate/i18n';

/**
 * Obtiene el nombre traducido de una columna basado en su código
 * @param {string} code - Código de la columna
 * @param {string} fallbackName - Nombre por defecto si no hay traducción
 * @returns {string} - Nombre traducido de la columna
 */
export const getColumnDisplayName = (code, fallbackName = '') => {
  if (!code) {
    return fallbackName;
  }

  // Intentar obtener la traducción del código
  const translation = i18n.t(`leads.columnCodes.${code}`);

  // Si la traducción es igual al código, significa que no existe la traducción
  if (translation === `leads.columnCodes.${code}`) {
    return fallbackName || code;
  }

  return translation;
};

/**
 * Obtiene el nombre traducido de una columna con fallback al nombre original
 * @param {Object} column - Objeto de columna con code y name
 * @returns {string} - Nombre traducido de la columna
 */
export const getColumnName = (column) => {
  if (!column) return '';

  return getColumnDisplayName(column.code, column.name);
};

/**
 * Verifica si una columna es del sistema (no se puede eliminar)
 * @param {Object} column - Objeto de columna
 * @returns {boolean} - True si es columna del sistema
 */
export const isSystemColumn = (column) => {
  return column && column.isSystem === true;
};

/**
 * Verifica si una columna tiene un código genérico
 * @param {Object} column - Objeto de columna
 * @returns {boolean} - True si tiene código genérico
 */
export const hasGenericCode = (column) => {
  return column && column.code && column.code.length > 0;
};
