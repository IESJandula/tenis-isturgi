/**
 * Utility functions for formatting data in the frontend.
 */

/**
 * Formats a date string into a Spanish long date format.
 * @param {string|Date} fecha - The date to format.
 * @returns {string} - Formatted date (e.g., "15 de octubre de 2026").
 */
export const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', opciones);
};

/**
 * Truncates a string to a specific length and adds an ellipsis.
 * @param {string} texto - The text to truncate.
 * @param {number} maxLength - Maximum length.
 * @returns {string} - Truncated text.
 */
export const truncarTexto = (texto, maxLength = 100) => {
    if (!texto) return '';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength).trim() + '...';
};

/**
 * Formats file size in bytes to a human-readable string (KB/MB).
 * @param {number} bytes - Size in bytes.
 * @returns {string} - Formatted size.
 */
export const formatearTamano = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
};
