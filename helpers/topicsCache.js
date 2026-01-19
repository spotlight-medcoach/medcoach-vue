/**
 * Helper para manejar el caché de topics en localStorage
 * El caché se guarda con un TTL (tiempo de vida) para evitar consultas innecesarias
 */

const CACHE_KEY = 'topicsCache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos en milisegundos

/**
 * Guarda los topics en caché con timestamp
 * @param {Array} topics - Lista de topics
 */
export function setTopicsCache (topics) {
  if (!process.client || !topics) {
    return;
  }

  const cacheData = {
    data: topics,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Error saving topics cache:', error);
  }
}

/**
 * Obtiene los topics del caché si es válido
 * @returns {Array|null} - Lista de topics o null si no hay caché válido
 */
export function getTopicsCache () {
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
      clearTopicsCache();
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.warn('Error reading topics cache:', error);
    clearTopicsCache();
    return null;
  }
}

/**
 * Verifica si existe un caché válido (no expirado)
 * @returns {boolean}
 */
export function hasValidTopicsCache () {
  return getTopicsCache() !== null;
}

/**
 * Limpia el caché de topics
 */
export function clearTopicsCache () {
  if (!process.client) {
    return;
  }

  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Error clearing topics cache:', error);
  }
}
