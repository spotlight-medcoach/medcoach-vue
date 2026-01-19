/**
 * Helper para manejar el caché del perfil del estudiante en localStorage
 * El perfil se guarda con un TTL (tiempo de vida) para evitar consultas innecesarias
 */

const CACHE_KEY = 'studentProfileCache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos en milisegundos

/**
 * Guarda el perfil del estudiante en caché con timestamp
 * @param {Object} studentInfo - Información del estudiante
 */
export function setStudentCache (studentInfo) {
  if (!process.client || !studentInfo) {
    return;
  }

  const cacheData = {
    data: studentInfo,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Error saving student cache:', error);
  }
}

/**
 * Obtiene el perfil del estudiante del caché si es válido
 * @returns {Object|null} - Información del estudiante o null si no hay caché válido
 */
export function getStudentCache () {
  if (!process.client) {
    return null;
  }

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      return null;
    }

    const cacheData = JSON.parse(cached);

    // Verificar si el caché expiró
    if (Date.now() - cacheData.timestamp > CACHE_TTL) {
      clearStudentCache();
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.warn('Error reading student cache:', error);
    clearStudentCache();
    return null;
  }
}

/**
 * Verifica si existe un caché válido (no expirado)
 * @returns {boolean}
 */
export function hasValidCache () {
  return getStudentCache() !== null;
}

/**
 * Limpia el caché del estudiante
 * Debe llamarse cuando se actualiza el perfil o se cierra sesión
 */
export function clearStudentCache () {
  if (!process.client) {
    return;
  }

  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Error clearing student cache:', error);
  }
}

/**
 * Actualiza el caché con nueva información
 * Útil después de actualizar el perfil en settings
 * @param {Object} studentInfo - Nueva información del estudiante
 */
export function updateStudentCache (studentInfo) {
  clearStudentCache();
  setStudentCache(studentInfo);
}

/**
 * Obtiene el tiempo restante del caché en segundos
 * @returns {number} - Segundos restantes o 0 si no hay caché
 */
export function getCacheTimeRemaining () {
  if (!process.client) {
    return 0;
  }

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      return 0;
    }

    const cacheData = JSON.parse(cached);
    const remaining = CACHE_TTL - (Date.now() - cacheData.timestamp);

    return Math.max(0, Math.floor(remaining / 1000));
  } catch (error) {
    return 0;
  }
}
